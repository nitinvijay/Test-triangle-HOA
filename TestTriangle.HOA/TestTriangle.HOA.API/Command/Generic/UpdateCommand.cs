using System;
using System.Collections.Generic;
using System.Text;
using TestTriangle.HOA.Data.Models;

namespace TestTriangle.HOA.API.Command.Generic
{
    public class UpdateCommand<T> where T : BaseModel
    {
        public T Data { get; set; }
        public int Id { get; set; }
    }
}
