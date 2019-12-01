using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestTriangle.HOA.Data.Context;
using TestTriangle.HOA.Data.Context.Entity;
using TestTriangle.HOA.Data.Models;
using TestTriangle.HOA.Data.Repository.Contracts;
using TestTriangle.HOA.Extensions.Extension;

namespace TestTriangle.HOA.Data.Repository.Implementation
{
    public class CommonRepository : ICommonRepository
    {
        TestTriangleHOAContext _context;
        ISpProvider _spProvider;

        public CommonRepository(TestTriangleHOAContext context)
        {
            _context = context;
            _spProvider = new SpProvider(_context);
        }

        public CommonRepository()
        {
            _context = new TestTriangleHOAContext();
        }

        public QueryResponse<Dropdown> GetCountries()
        {
            var countries = this._spProvider.ExecutelstSql<Dropdown>("usp_GetCountries");
            return new QueryResponse<Dropdown>() { Success = true, Data = countries };
        }

        public QueryResponse<Dropdown> GetStatus()
        {
            var status = this._spProvider.ExecutelstSql<Dropdown>("usp_GetStatus");
            return new QueryResponse<Dropdown>() { Success = true, Data = status };
        }
    }
}
