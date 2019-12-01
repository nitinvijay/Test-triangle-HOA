using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestTriangleHOA.Web.Models
{
    public class BaseModel
    {

    }

    public class Response
    {
        public bool Success { get; set; }
        public string[] Errors { get; set; }
    }

    public class QueryResponse<T> : Response where T : BaseModel
    {
        public IEnumerable<T> Data { get; set; }
        public int TotalCount { get; set; }
    }

    public class QuerySingleResponse<T> : Response where T : BaseModel
    {
        public T Data { get; set; }
    }

    public class Response<T> : Response where T : BaseModel
    {

    }

}
