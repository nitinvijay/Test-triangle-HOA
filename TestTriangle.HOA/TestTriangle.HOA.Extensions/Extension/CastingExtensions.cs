using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace TestTriangle.HOA.Extensions.Extension
{
    public static class CastingExtensions
    {

        public static bool EqualsTo(object _Left, object _Right, List<string> _ExceptProp = null)
        {
            if (_ExceptProp == null)
                _ExceptProp = new List<string>();

            var leftProps = TypeDescriptor.GetProperties(_Left.GetType()).OfType<PropertyDescriptor>().Where(w => _ExceptProp.Any(a => a == w.Name)).Select(s => new { Name = s.Name, Value = s.GetValue(_Left) }).ToDictionary(p => p.Name, p => p.Value);
            var rightProps = TypeDescriptor.GetProperties(_Right.GetType()).OfType<PropertyDescriptor>().Where(w => _ExceptProp.Any(a => a == w.Name)).Select(s => new { Name = s.Name, Value = s.GetValue(_Right) }).ToDictionary(p => p.Name, p => p.Value);
            var _difference = leftProps.Where(x => rightProps.Any(a => a.Key == x.Key)).Where(entry => rightProps[entry.Key] != entry.Value)
                 .ToDictionary(entry => entry.Key, entry => entry.Value);

            return _difference.Count == 0;
        }

        public static T EqualsTO<T>(this object _Object, List<string> _ExceptProp = null) where T : new()
        {
            if (_ExceptProp == null)
                _ExceptProp = new List<string>();
            if (typeof(T).GetInterfaces()
                .Any(ti => ti.IsGenericType
                     && ti.GetGenericTypeDefinition() == typeof(IEnumerable<>)))
                throw new Exception("Provided type to cast must not be enumrable");
            T obj = new T();
            var _Tprops = TypeDescriptor.GetProperties(typeof(T)).OfType<PropertyDescriptor>().ToList();
            var _Objectprops = TypeDescriptor.GetProperties(_Object.GetType()).OfType<PropertyDescriptor>().ToList();
            _Tprops.Where(w => _Objectprops.Any(a => a.Name.ToLower() == w.Name.ToLower())).ToList().ForEach(
                    f =>
                    {
                        var _propInfo = _Objectprops.FirstOrDefault(i => f.Name.ToLower() == i.Name.ToLower());
                        if (_propInfo.PropertyType.FullName == f.PropertyType.FullName)
                            f.SetValue(obj, _propInfo.GetValue(_Object));
                        else
                            f.SetValue(obj, _propInfo.GetValue(_Object).TryCast(f.PropertyType));
                    });
            return obj;
        }

        public static T TO<T>(this object _Object) where T : new()
        {
            if (typeof(T).GetInterfaces()
                .Any(ti => ti.IsGenericType
                     && ti.GetGenericTypeDefinition() == typeof(IEnumerable<>)))
                throw new Exception("Provided type to cast must not be enumrable");
            T obj = new T();
            var _Tprops = TypeDescriptor.GetProperties(typeof(T)).OfType<PropertyDescriptor>().ToList();
            var _Objectprops = TypeDescriptor.GetProperties(_Object.GetType()).OfType<PropertyDescriptor>().ToList();
            _Tprops.Where(w => _Objectprops.Any(a => a.Name.ToLower() == w.Name.ToLower())).ToList().ForEach(
                    f =>
                    {
                        var _propInfo = _Objectprops.FirstOrDefault(i => f.Name.ToLower() == i.Name.ToLower());
                        if (_propInfo.PropertyType.FullName == f.PropertyType.FullName)
                            f.SetValue(obj, _propInfo.GetValue(_Object));
                        else
                            f.SetValue(obj, _propInfo.GetValue(_Object).TryCast(f.PropertyType));
                    });
            return obj;
        }

        public static List<T> AsList<T>(this IEnumerable _Object) where T : new()
        {


            if (_Object == null)
                return new List<T>();

            if (!_Object.GetType().GetInterfaces()
                .Any(ti => ti.IsGenericType
                     && ti.GetGenericTypeDefinition() == typeof(IEnumerable<>)))
                throw new Exception("Provided type to cast must be enumrable");

            List<T> _result = new List<T>();
            var _Tprops = TypeDescriptor.GetProperties(typeof(T)).OfType<PropertyDescriptor>().ToList();
            var _Objectprops = TypeDescriptor.GetProperties(_Object.GetType()).OfType<PropertyDescriptor>().ToList();
            IEnumerator enumerator = _Object.GetEnumerator();
            while (enumerator.MoveNext())
            {
                T obj = new T();
                object item = enumerator.Current;
                var itemProps = TypeDescriptor.GetProperties(item.GetType()).OfType<PropertyDescriptor>().ToList();
                _Tprops.Where(w => itemProps.Any(a => a.Name.ToLower() == w.Name.ToLower())).ToList().ForEach(
                    f =>
                    {
                        var _propInfo = itemProps.FirstOrDefault(i => f.Name.ToLower() == i.Name.ToLower());
                        if (_propInfo.PropertyType.FullName == f.PropertyType.FullName)
                            f.SetValue(obj, _propInfo.GetValue(item));
                        else
                            f.SetValue(obj, _propInfo.GetValue(item).TryCast(f.PropertyType));
                    });
                _result.Add(obj);

            }
            return _result;

        }

        public static object TO(this object _Object, Type _Type)
        {
            if (_Type.GetInterfaces()
                .Any(ti => ti.IsGenericType
                     && ti.GetGenericTypeDefinition() == typeof(IEnumerable<>)))
                throw new Exception("Provided type to cast must not be enumrable");
            var obj = Activator.CreateInstance(_Type);
            var _Tprops = TypeDescriptor.GetProperties(_Type).OfType<PropertyDescriptor>().ToList();
            var _Objectprops = TypeDescriptor.GetProperties(_Object.GetType()).OfType<PropertyDescriptor>().ToList();
            _Tprops.Where(w => _Objectprops.Any(a => a.Name.ToLower() == w.Name.ToLower())).ToList().ForEach(
                    f =>
                    {
                        var _propInfo = _Objectprops.FirstOrDefault(i => f.Name.ToLower() == i.Name.ToLower());
                        if (_propInfo.PropertyType.FullName == f.PropertyType.FullName)
                            f.SetValue(obj, _propInfo.GetValue(_Object));
                        else
                            f.SetValue(obj, _propInfo.GetValue(_Object).TryCast(f.PropertyType));
                    });
            return obj;
        }

        public static object TOAuditEntity(this Dictionary<string, object> _Props, Type _Type)
        {
            var obj = Activator.CreateInstance(_Type);
            var _Tprops = TypeDescriptor.GetProperties(_Type).OfType<PropertyDescriptor>().ToList();
            _Tprops.Where(w => _Props.Any(a => a.Key.ToLower() == w.Name.ToLower())).ToList().ForEach(
                   f =>
                   {
                       var _propInfo = _Props.FirstOrDefault(i => f.Name.ToLower() == i.Key.ToLower());
                       f.SetValue(obj, _propInfo.Value);
                   });
            return obj;
        }

        public static Dictionary<string, object> SetProperty(this Dictionary<string, object> _Props, string PropertyName, object Value)
        {

            if (_Props.Any(a => string.Equals(a.Key, PropertyName, StringComparison.OrdinalIgnoreCase) == true))
                _Props[PropertyName] = Value;
            else
                _Props.Add(PropertyName, Value);
            return _Props;
        }

        public static List<P> CastTo<P>(this IEnumerable<IDataRecord> _iDataRecords) where P : new()
        {
            List<P> _result = new List<P>();
            PropertyInfo[] _propertyInfo = new P().GetType().GetProperties();
            _iDataRecords.ToList().ForEach
            (i =>
            {
                P obj = new P();
                List<string> lstProps = Enumerable.Range(1, i.FieldCount).Select((e, index) => i.GetName(index).ToString().ToLower()).ToList();
                foreach (PropertyInfo prop in _propertyInfo)
                {
                    if ((lstProps.Any(a => a == prop.Name.ToLower())) && !object.Equals(i[prop.Name], DBNull.Value))
                    {
                        if (prop.PropertyType.FullName == i[prop.Name].GetType().FullName)
                            prop.SetValue(obj, i[prop.Name] != System.DBNull.Value ? i[prop.Name] : null, null);
                        else if (prop.PropertyType.IsEnum)
                        {
                            var _v = Enum.Parse(prop.PropertyType, Convert.ToString(i[prop.Name]));
                            prop.SetValue(obj, _v, null);
                        }
                        else
                            prop.SetValue(obj, i[prop.Name].TryCast(prop.PropertyType), null);
                    }
                }
                _result.Add(obj);
            }
            );
            return _result;
        }
    }
}
