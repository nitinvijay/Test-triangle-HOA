using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace TestTriangle.HOA.Extensions.Extension
{
    public static class ConfigHelper
    {
        public static IConfiguration Configuration;

        public static string GetDBConnectionString()
        {
            return Configuration["DBConnectionString"];
        }
    }
}
