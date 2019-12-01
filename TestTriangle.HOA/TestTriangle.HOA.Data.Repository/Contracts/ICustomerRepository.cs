using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TestTriangle.HOA.Data.Models;
using TestTriangle.HOA.Extensions.Extension;

namespace TestTriangle.HOA.Data.Repository.Contracts
{
    public interface ICustomerRepository
    {
        QueryResponse<QueryCustomerModel> GetCustomersAsync(int page = 1, int pageSize = 50, string orderBy = "FirstName", string dir = "asc", List<SearchParams> Filters = null);
        Task<QueryCustomerModel> FindCustomerAsync(int id);
        Task<QueryCustomerModel> InsertCustomerAsync(CommandCustomerModel customer);
        Task<bool> UpdatCustomerAsync(int id, CommandCustomerModel customer);
        Task<bool> DeleteCustomerAsync(int id);
    }
}
