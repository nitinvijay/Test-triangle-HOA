using Microsoft.AspNetCore.Authentication.AzureAD.UI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestTriangle.HOA.API.Command.Generic;
using TestTriangle.HOA.API.Command.Handler;
using TestTriangle.HOA.API.Model;
using TestTriangle.HOA.API.Query.Generic;
using TestTriangle.HOA.API.Query.Handler;
using TestTriangle.HOA.Data.Models;

namespace TestTriangle.HOA.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly CustomerCommandHandler _customerCommandHandler;
        private readonly CustomerQueryHandler _customerQueryHandler;

        public CustomerController(CustomerCommandHandler customerCommandHandler,
                                  CustomerQueryHandler customerQueryHandler)
        {
            _customerCommandHandler = customerCommandHandler;
            _customerQueryHandler = customerQueryHandler;

        }

        // GET: api/Customer
        [HttpGet]
        public async Task<ActionResult<QueryResponse<QueryCustomerModel>>> GetCustomers([FromQuery]Odata request)
        {
            // Initialize / set to default parameters
            if (string.IsNullOrEmpty(request.orderBy))
            {
                request.orderBy = "firstname";
            }
            if (string.IsNullOrEmpty(request.dir))
            {
                request.dir = "Asc";
            }
            var query = new GetAllQuery<QueryCustomerModel>(request.page, request.pageSize, request.orderBy, request.dir, request.filter);
            var customers = _customerQueryHandler.HandleAsync(query);
            return customers;
        }

        // GET: api/Customer/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QuerySingleResponse<QueryCustomerModel>>> GetCustomer(int id)
        {
            var query = new FindQuery<QueryCustomerModel>() { Id = id };
            var customer = await _customerQueryHandler.HandleAsync(query);

            if (customer == null)
            {
                return NotFound(new { message = "Customer not found" });
            }
            var response = new QuerySingleResponse<QueryCustomerModel>();
            response.Data = customer;
            response.Success = true;
            return response;
        }

        // PUT: api/Customer/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Response<QueryCustomerModel>>> PutCustomer(int id, CommandCustomerModel customer)
        {
            try
            {
                var command = new UpdateCommand<CommandCustomerModel>()
                {
                    Id = id,
                    Data = customer
                };

                bool result = await _customerCommandHandler.HandleAsync(command);

                if (!result)
                {
                    return NotFound(new { message = "Customer not found" });
                }
                var response = new Response<QueryCustomerModel>();
                response.Success = result;
                return response;
            }
            catch (Exception ex)
            {
                // log ex as exception
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        // POST: api/Customer
        [HttpPost]
        public async Task<ActionResult<QuerySingleResponse<QueryCustomerModel>>> PostCustomer(CommandCustomerModel customer)
        {
            var command = new InsertCommand<CommandCustomerModel>()
            {
                Data = customer
            };
            var data = await _customerCommandHandler.HandleAsync(command);
            var response = new QuerySingleResponse<QueryCustomerModel>();
            response.Success = true;
            response.Data = data;
            return CreatedAtAction("GetCustomer", new { id = data.CustomerId }, response);
        }

        // DELETE: api/Customer/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Response<QueryCustomerModel>>> DeleteCustomer(int id)
        {
            var command = new DeleteCommand() { Id = id };
            var isSuccess = await _customerCommandHandler.HandleAsync(command);
            var response = new Response<QueryCustomerModel>();
            response.Success = isSuccess;
            return response;
        }
    }
}
