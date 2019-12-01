using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestTriangleHOA.Web.Models
{
    public class BaseResponse<T>
    {
        public bool Success { get; set; }
        public IList<T> Data { get; set; }
        public int TotalCount { get; set; }
        public string[] Errors { get; set; }

    }
}
