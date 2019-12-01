using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestTriangle.HOA.API.Command.Generic;
using TestTriangle.HOA.API.Command.Handler;
using TestTriangle.HOA.API.Query.Generic;
using TestTriangle.HOA.API.Query.Handler;
using TestTriangle.HOA.Data.Models;

namespace TestTriangle.HOA.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerTicketController : ControllerBase
    {
        private readonly CustomerCommandHandler _customerCommandHandler;
        private readonly CustomerQueryHandler _customerQueryHandler;
        private readonly TicketCommandHandler _ticketCommandHandler;
        private readonly TicketQueryHandler _ticketQueryHandler;

        public CustomerTicketController(CustomerCommandHandler customerCommandHandler,
                                  CustomerQueryHandler customerQueryHandler,
                                  TicketCommandHandler ticketCommandHandler,
                                TicketQueryHandler ticketQueryHandler)
        {
            _customerCommandHandler = customerCommandHandler;
            _customerQueryHandler = customerQueryHandler;
            _ticketCommandHandler = ticketCommandHandler;
            _ticketQueryHandler = ticketQueryHandler;

        }


        // POST: api/Customer
        [HttpPost]
        public async Task<ActionResult<QuerySingleResponse<QueryCustomerModel>>> CustomerTicket(CommandCustomerTicketModel customerTickets)
        {
            var command = new InsertCommand<CommandCustomerModel>()
            {
                Data = customerTickets
            };
            var data = await _customerCommandHandler.HandleAsync(command);
            if (data.CustomerId > 0)
            {
                customerTickets.Tickets.ForEach(f =>
                {
                    f.CustomerId = data.CustomerId;
                    var ticketCommand = new InsertCommand<CommandTicketModel>()
                    {
                        Data = f
                    };
                    var ticketData = _ticketCommandHandler.HandleAsync(ticketCommand).Result;
                });
            }

            var response = new QuerySingleResponse<QueryCustomerModel>();
            response.Success = true;
            response.Data = data;
            return StatusCode(StatusCodes.Status201Created, response);
        }
    }
}
