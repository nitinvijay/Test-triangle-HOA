using Microsoft.Extensions.Configuration;
using System;

namespace TestTriangle.HOA.Common
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
