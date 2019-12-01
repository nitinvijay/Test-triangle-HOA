using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestTriangle.HOA.API.Model
{
    public class Odata
    {
        public int page { get; set; } = 1;
        public int pageSize { get; set; } = 50;
        public string orderBy { get; set; }
        public string dir { get; set; }
        public string filter { get; set; }
    }
}
