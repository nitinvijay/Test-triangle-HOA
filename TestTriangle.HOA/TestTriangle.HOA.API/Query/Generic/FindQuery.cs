using System;
using System.Collections.Generic;
using System.Text;
using TestTriangle.HOA.Data.Models;

namespace TestTriangle.HOA.API.Query.Generic
{
    public class FindQuery<T> where T : BaseModel
    {
        public int Id { get; set; }
    }
}
