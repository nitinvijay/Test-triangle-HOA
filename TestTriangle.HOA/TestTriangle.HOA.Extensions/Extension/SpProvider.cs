using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Text;
using System.Linq;
using System.Data;
using TestTriangle.HOA.Extensions.Extension;

namespace TestTriangle.HOA.Extensions.Extension
{
    public interface ISpProvider
    {
        TResult ExecuteSql<TResult>(string spName, params object[] parameters) where TResult : new();

        TResult ExecuteScalerSql<TResult>(string spName, params object[] parameters);

        List<TResult> ExecutelstSql<TResult>(string spName, params object[] parameters) where TResult : new();
        List<TResult> ExecutelstSql<TResult>(string spName, Dictionary<string, object> parameters) where TResult : new();

        void ExecuteNonQuery(string query, params object[] parameters);

        List<TResult> ExecutelstQuery<TResult>(string query, params object[] parameters) where TResult : new();

        List<string> ExecutelstQuery(string query, params object[] parameters);

        List<TResult> ExecutelstQuery<TResult>(string query, Dictionary<string, object> parameters) where TResult : new();

    }

    public sealed class SpProvider : ISpProvider
    {
        public SpProvider(DbContext Context)
        {
            this._context = Context;
        }

        #region Context
        private DbContext _context { get; set; }
        #endregion

        #region Execute SQL

        private void AddParameters(DbCommand cmd, params object[] parameters)
        {
            if (parameters != null)
                parameters.ToList().ForEach(f =>
                {
                    DbParameter dbParameter = cmd.CreateParameter();
                    dbParameter.ParameterName = f.GetType().GetProperties()[0].Name;
                    dbParameter.Value = f.GetType().GetProperties()[0].GetValue(f);
                    cmd.Parameters.Add(dbParameter);
                });
        }

        private void AddParameters(DbCommand cmd, Dictionary<string, object> parameters)
        {
            if (parameters != null)
            {
                parameters.Keys.ToList().ForEach(f =>
                {
                    DbParameter dbParameter = cmd.CreateParameter();
                    dbParameter.ParameterName = f;
                    dbParameter.Value = parameters[f] ?? DBNull.Value;
                    cmd.Parameters.Add(dbParameter);
                });
            }
        }

        TResult ISpProvider.ExecuteSql<TResult>(string spName, params object[] parameters)
        {
            DbConnection conn = _context.Database.GetDbConnection();
            ConnectionState initialState = conn.State;
            try
            {
                if (initialState != ConnectionState.Open)
                    conn.Open();  // open connection if not already open
                using (DbCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 0;
                    try
                    {
                        AddParameters(cmd, parameters);
                        cmd.CommandText = spName;
                        using (DbDataReader dr = cmd.ExecuteReader())
                        {

                            List<TResult> _TResult = dr.Cast<IDataRecord>().CastTo<TResult>();
                            return _TResult.FirstOrDefault();
                        }
                    }
                    catch (Exception exception)
                    {
                        throw new DataException("Something went wrong, please contact system administrator.");
                    }
                }
            }
            finally
            {
                if (initialState != ConnectionState.Open)
                    conn.Close(); // only close connection if not initially open
            }
        }

        void ISpProvider.ExecuteNonQuery(string query, params object[] parameters)
        {
            DbConnection conn = _context.Database.GetDbConnection();
            ConnectionState initialState = conn.State;
            try
            {
                if (initialState != ConnectionState.Open)
                    conn.Open();  // open connection if not already open
                using (DbCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandTimeout = 0;
                    try
                    {
                        AddParameters(cmd, parameters);
                        cmd.CommandText = query;
                        cmd.ExecuteNonQuery();
                    }
                    catch (Exception exception)
                    {
                        throw new DataException("Something went wrong, please contact system administrator.");
                    }
                }
            }
            finally
            {
                if (initialState != ConnectionState.Open)
                    conn.Close(); // only close connection if not initially open
            }
        }


        List<TResult> ISpProvider.ExecutelstSql<TResult>(string spName, params object[] parameters)
        {
            DbConnection conn = _context.Database.GetDbConnection();
            ConnectionState initialState = conn.State;
            try
            {
                if (initialState != ConnectionState.Open)
                    conn.Open();  // open connection if not already open

                using (DbCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 0;
                    try
                    {
                        //string query = "EXECUTE " + spName;

                        //for (var i = 0; i < parameters.Length; i++)
                        //    query += parameters[i].GetParameterInfo() + ",";
                        //query = query.TrimEnd(',');
                        AddParameters(cmd, parameters);
                        cmd.CommandText = spName;
                        //DataTable dt = new DataTable();
                        //var dataAdapter = conn.CreateDataAdapter();
                        //dataAdapter.SelectCommand = cmd;
                        //dataAdapter.Fill(dt);

                        using (DbDataReader dr = cmd.ExecuteReader())
                        {
                            var PropertyType = typeof(TResult);
                            if (PropertyType.IsPrimitive || PropertyType.IsValueType || PropertyType == (typeof(string)))
                            {
                                return dr.Cast<IDataRecord>().ToList().Select(s => s[0].TryCast<TResult>()).ToList();
                            }
                            List<TResult> _TResult = dr.Cast<IDataRecord>().CastTo<TResult>();
                            return _TResult;
                        }
                    }
                    catch (Exception exception)
                    {
                        throw new DataException("Something went wrong, please contact system administrator.");
                    }
                }
            }
            finally
            {
                if (initialState != ConnectionState.Open)
                    conn.Close(); // only close connection if not initially open
            }
        }

        TResult ISpProvider.ExecuteScalerSql<TResult>(string spName, params object[] parameters)
        {
            DbConnection conn = _context.Database.GetDbConnection();
            ConnectionState initialState = conn.State;
            try
            {
                if (initialState != ConnectionState.Open)
                    conn.Open();  // open connection if not already open
                using (DbCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 0;
                    try
                    {
                        //string query = "EXECUTE " + spName;

                        //for (var i = 0; i < parameters.Length; i++)
                        //    query += parameters[i].GetParameterInfo() + ",";
                        //query = query.TrimEnd(',');
                        AddParameters(cmd, parameters);
                        cmd.CommandText = spName;
                        if (typeof(TResult) == typeof(byte[]) || typeof(TResult) == typeof(Byte[]))
                        {
                            return (TResult)cmd.ExecuteScalar();
                        }
                        TResult _result = cmd.ExecuteScalar().TryCast<TResult>();
                        return _result;
                    }
                    catch (Exception exception)
                    {
                        throw new DataException("Something went wrong, please contact system administrator.");
                    }
                }
            }
            finally
            {
                if (initialState != ConnectionState.Open)
                    conn.Close(); // only close connection if not initially open
            }
        }


        List<TResult> ISpProvider.ExecutelstQuery<TResult>(string query, Dictionary<string, object> parameters)
        {
            DbConnection conn = _context.Database.GetDbConnection();
            ConnectionState initialState = conn.State;
            try
            {
                if (initialState != ConnectionState.Open)
                    conn.Open();  // open connection if not already open
                using (DbCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandType = CommandType.Text;
                    try
                    {
                        AddParameters(cmd, parameters);
                        cmd.CommandText = query;
                        using (DbDataReader dr = cmd.ExecuteReader())
                        {
                            List<TResult> _TResult = dr.Cast<IDataRecord>().CastTo<TResult>();
                            return _TResult;
                        }
                    }
                    catch (Exception exception)
                    {
                        throw new DataException("Something went wrong, please contact system administrator.");
                    }
                }
            }
            finally
            {
                if (initialState != ConnectionState.Open)
                    conn.Close(); // only close connection if not initially open
            }
        }
        List<TResult> ISpProvider.ExecutelstQuery<TResult>(string query, params object[] parameters)
        {
            DbConnection conn = _context.Database.GetDbConnection();

            ConnectionState initialState = conn.State;
            try
            {
                if (initialState != ConnectionState.Open)
                    conn.Open();  // open connection if not already open
                using (DbCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandTimeout = 0;
                    try
                    {
                        AddParameters(cmd, parameters);
                        cmd.CommandText = query;
                        using (DbDataReader dr = cmd.ExecuteReader())
                        {
                            var PropertyType = typeof(TResult);
                            if (PropertyType.IsPrimitive || PropertyType.IsValueType || PropertyType == (typeof(string)))
                            {
                                return dr.Cast<IDataRecord>().ToList().Select(s => s[0].TryCast<TResult>()).ToList();
                            }
                            List<TResult> _TResult = dr.Cast<IDataRecord>().CastTo<TResult>();
                            return _TResult;
                        }
                    }
                    catch (Exception exception)
                    {
                        throw new DataException("Something went wrong, please contact system administrator.");
                    }
                }
            }
            finally
            {
                if (initialState != ConnectionState.Open)
                    conn.Close(); // only close connection if not initially open
            }
        }

        List<string> ISpProvider.ExecutelstQuery(string query, params object[] parameters)
        {
            DbConnection conn = _context.Database.GetDbConnection();

            ConnectionState initialState = conn.State;
            try
            {
                if (initialState != ConnectionState.Open)
                    conn.Open();  // open connection if not already open
                using (DbCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandTimeout = 0;
                    try
                    {
                        AddParameters(cmd, parameters);
                        cmd.CommandText = query;
                        using (DbDataReader dr = cmd.ExecuteReader())
                        {
                            return dr.Cast<IDataRecord>().ToList().Select(s => Convert.ToString(s[0])).ToList();
                        }
                    }
                    catch (Exception exception)
                    {
                        throw new DataException("Something went wrong, please contact system administrator.");
                    }
                }
            }
            finally
            {
                if (initialState != ConnectionState.Open)
                    conn.Close(); // only close connection if not initially open
            }
        }

        
        public List<TResult> ExecutelstSql<TResult>(string spName, Dictionary<string, object> parameters) where TResult : new()
        {
            DbConnection conn = _context.Database.GetDbConnection();
            ConnectionState initialState = conn.State;
            try
            {
                if (initialState != ConnectionState.Open)
                    conn.Open();  // open connection if not already open
                using (DbCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 0;
                    try
                    {
                        AddParameters(cmd, parameters);
                        cmd.CommandText = spName;
                        using (DbDataReader dr = cmd.ExecuteReader())
                        {

                            var PropertyType = typeof(TResult);
                            if (PropertyType.IsPrimitive || PropertyType.IsValueType || PropertyType == (typeof(string)))
                            {
                                return dr.Cast<IDataRecord>().ToList().Select(s => s[0].TryCast<TResult>()).ToList();
                            }
                            List<TResult> _TResult = dr.Cast<IDataRecord>().CastTo<TResult>();
                            return _TResult;
                        }
                    }
                    catch (Exception exception)
                    {
                        throw new DataException("Something went wrong, please contact system administrator.");
                    }
                }
            }
            finally
            {
                if (initialState != ConnectionState.Open)
                    conn.Close(); // only close connection if not initially open
            }
        }

        #endregion


    }
}
