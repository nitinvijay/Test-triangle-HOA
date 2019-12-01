using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TestTriangle.HOA.Data.Models;
using TestTriangle.HOA.Data.Repository.Contracts;
using System.Linq;
using TestTriangle.HOA.Data.Context;
using TestTriangle.HOA.Extensions.Extension;
using TestTriangle.HOA.Data.Context.Entity;

namespace TestTriangle.HOA.Data.Repository.Implementation
{
    public class CustomerRepository : ICustomerRepository
    {
        TestTriangleHOAContext _context;

        public CustomerRepository(TestTriangleHOAContext context)
        {
            _context = context;
        }

        public CustomerRepository()
        {
            _context = new TestTriangleHOAContext();
        }

        public QueryResponse<QueryCustomerModel> GetCustomersAsync(int page = 1, int pageSize = 50, string orderBy = "FirstName",
            string dir = "asc", List<SearchParams> Filters = null)
        {
            int pageCount; int totalCount;
            var data =
            _context.Customer
            .DynamicOrderBy(orderBy, dir == "asc")
            .DynamicWhere(Filters)
            //.OrderBy(o => o.FirstName).AsQueryable()
            .TakePage(page, pageSize, out pageCount, out totalCount);
            //int skip = page > 1 ? (page - 1) * pageSize : 0;
            //if (skip > 0)
            //{
            //    data = data.Skip(skip);
            //}
            //data = data.Take(pageSize);

            var count = totalCount; // _context.Customer.Count();

            return new QueryResponse<QueryCustomerModel>()
            {
                Data = data.AsList<QueryCustomerModel>(),
                TotalCount = count,
                Success = true
            };
        }

        public async Task<QueryCustomerModel> FindCustomerAsync(int id)
        {
            return _context.Customer.FindAsync(id).Result.TO<QueryCustomerModel>();
        }

        public async Task<QueryCustomerModel> InsertCustomerAsync(CommandCustomerModel customer)
        {
            try
            {
                var customerEntity = customer.TO<Customer>();
                customerEntity.CreatedOn = DateTime.Now;
                _context.Customer.Add(customerEntity);
                await _context.SaveChangesAsync();
                return customerEntity.TO<QueryCustomerModel>();
            }
            catch (Exception ex)
            {
                throw new Exception("Something went wrong, please contact system administrator.");
            }

        }

        public async Task<bool> UpdatCustomerAsync(int id, CommandCustomerModel customer)
        {
            var customerEntity = await _context.Customer.FindAsync(id);
            if (customerEntity != null)
            {
                customerEntity.Address = customer.Address;
                customerEntity.City = customer.City;
                customerEntity.Country = customer.Country;
                customerEntity.FirstName = customer.FirstName;
                customerEntity.LastName = customer.LastName;
                customerEntity.Phone = customer.Phone;
                customerEntity.PostalCode = customer.PostalCode;
                customerEntity.State = customer.State;
                _context.Entry(customerEntity).State = EntityState.Modified;
            }
            else
            {
                throw new Exception("Customer does not exists.");
            }

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Something went wrong, please contact system administrator.");
            }

        }

        public async Task<bool> DeleteCustomerAsync(int id)
        {
            var customer = await _context.Customer.FindAsync(id);
            if (customer == null)
            {
                throw new Exception("Customer does not exists.");
            }
            try
            {
                _context.Customer.Remove(customer);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Something went wrong, please contact system administrator.");
            }
            return true;
        }


    }
}
