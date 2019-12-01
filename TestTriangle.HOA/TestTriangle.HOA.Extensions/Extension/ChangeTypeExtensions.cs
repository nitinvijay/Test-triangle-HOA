using System;
using System.Collections.Generic;
using System.Linq;

namespace TestTriangle.HOA.Extensions.Extension
{
    public static class ChangeTypeExtensions
    {

        /// <summary>
        /// Tries to cast <paramref name="value" /> to an instance of type <typeparamref name="T" /> .
        /// </summary>
        /// <typeparam name="T"> The type of the instance to return. </typeparam>
        /// <param name="value"> The value to cast. </param>
        /// <param name="result"> When this method returns true, contains <paramref name="value" /> cast as an instance of <typeparamref
        /// name="T" /> . When the method returns false, contains default(T). </param>
        /// <returns> True if <paramref name="value" /> is an instance of type <typeparamref name="T" /> ; otherwise, false. </returns>
        public static object TryCast(this object value, Type type)
        {
            var destinationType = type;
            var inputIsNull = (value == null || value == DBNull.Value);

            /*
            * If the given value is null, we'd normally set result to null and be done with it.
            * HOWEVER, if T is not a nullable type, then we can't REALLY cast null to that type, so
            * TryCast should return false.
            */
            if (inputIsNull)
            {
                // If T is nullable, this will result in a null value in result.
                // Otherwise this will result in a default instance in result.
                if (type.IsValueType)
                {
                    return Activator.CreateInstance(type);
                }
                else
                {
                    return null;
                }
            }

            // Convert.ChangeType fails when the destination type is nullable. If T is nullable we use the underlying type.
            var underlyingType = Nullable.GetUnderlyingType(destinationType) ?? destinationType;

            try
            {
                /*
                * At the moment I cannot remember why I handled Guid as a separate case, but
                * I must have been having problems with it at the time or I'd not have bothered.
                */
                if (underlyingType == typeof(Guid))
                {
                    if (value is Guid)
                    {
                        return value;
                    }
                    if (value is string)
                    {
                        value = new Guid(value as string);
                    }
                    if (value is byte[])
                    {
                        value = new Guid(value as byte[]);
                    }

                    return Convert.ChangeType(value, underlyingType);

                }
                else if (new List<Type> { typeof(bool), typeof(Boolean) }.Any(a => a == underlyingType))
                {
                    var newVal = Convert.ToString(value).ToLower();
                    switch (newVal)
                    {
                        case "true":
                        case "yes":
                        case "1":
                            return true;
                        case "false":
                        case "no":
                        case "0":
                            return false;
                    }
                }

                return Convert.ChangeType(value, underlyingType);

            }
            catch (Exception ex)
            {
                // This was originally used to help me figure out why some types weren't casting in Convert.ChangeType.
                // It could be removed, but you never know, somebody might comment on a better way to do THAT to.
                //var traceMessage = ex is InvalidCastException || ex is FormatException || ex is OverflowException
                // ? string.Format("The given value {0} could not be cast as Type {1}.", value, underlyingType.FullName)
                // : ex.Message;
                if (type.IsValueType)
                {
                    return Activator.CreateInstance(type);
                }
                return null;
            }
        }

        private static bool CanChange(Type toType, Type fromType)
        {
            var ConvertTypes = new Type[] {
typeof(object), typeof(DBNull), typeof(bool), typeof(char), typeof(sbyte), typeof(byte), typeof(short), typeof(ushort), typeof(int), typeof(uint), typeof(long), typeof(ulong), typeof(float), typeof(double), typeof(decimal),
typeof(DateTime), typeof(object), typeof(string)
};
            return (ConvertTypes.Contains(toType) || typeof(IConvertible).IsAssignableFrom(fromType));
        }
        /// <summary>
        /// Return true if the type is a System.Nullable wrapper of a value type
        /// </summary>
        /// <param name="type">The type to check</param>
        /// <returns>True if the type is a System.Nullable wrapper</returns>
        public static bool IsNullable(this Type type)
        {
            return type.IsGenericType
            && (type.GetGenericTypeDefinition() == typeof(Nullable<>));
        }


        /// <summary>
        /// Tries to cast <paramref name="value" /> to an instance of type <typeparamref name="T" /> .
        /// Description : TO cast from any type to any type. if error occurs than Gives default value to return
        /// </summary>
        /// <typeparam name="T"> The type of the instance to return. </typeparam>
        /// <param name="value"> The value to cast. </param>
        /// <param name="result"> When this method returns true, contains <paramref name="value" /> cast as an instance of <typeparamref
        /// name="T" /> . When the method returns false, contains default(T). </param>
        /// <returns> True if <paramref name="value" /> is an instance of type <typeparamref name="T" /> ; otherwise, false. </returns>
        public static T TryCast<T>(this object value)
        {
            var destinationType = typeof(T);
            var inputIsNull = (value == null || value == DBNull.Value);
            if (inputIsNull)
            {
                return default(T);
            }
            else if (!CanChange(value.GetType(), destinationType))
            {
                return default(T);
            }
            else
            {

                var underlyingType = Nullable.GetUnderlyingType(destinationType) ?? destinationType;
                try
                {
                    if (underlyingType == typeof(string) && value is Guid)
                    {
                        if (value is Guid && value != null)
                        {
                            return (T)Convert.ChangeType(Convert.ToString(value), underlyingType);
                        }
                    }

                    if (underlyingType == typeof(Guid))
                    {

                        if (value is string)
                        {
                            value = new Guid(value as string);
                        }
                        if (value is byte[])
                        {
                            value = new Guid(value as byte[]);
                        }

                        return (T)Convert.ChangeType(value, underlyingType);
                    }

                    return (T)Convert.ChangeType(value, underlyingType);
                }
                catch (Exception ex)
                {
                    //var traceMessage = ex is InvalidCastException || ex is FormatException || ex is OverflowException
                    // ? string.Format("The given value {0} could not be cast as Type {1}.", value, underlyingType.FullName)
                    // : ex.Message;
                    return default(T);
                }
            }
        }


    }
}
