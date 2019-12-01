using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TestTriangle.HOA.Data.Models;
using TestTriangle.HOA.Extensions.Extension;

namespace TestTriangle.HOA.Data.Repository.Contracts
{
    public interface ICommonRepository
    {
        QueryResponse<Dropdown> GetCountries();
        QueryResponse<Dropdown> GetStatus();
    }
}
