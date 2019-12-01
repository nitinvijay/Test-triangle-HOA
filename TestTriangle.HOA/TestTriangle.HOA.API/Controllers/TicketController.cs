using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestTriangle.HOA.API.Command.Generic;
using TestTriangle.HOA.API.Command.Handler;
using TestTriangle.HOA.API.Query;
using TestTriangle.HOA.API.Query.Generic;
using TestTriangle.HOA.API.Query.Handler;
using TestTriangle.HOA.Data.Models;

namespace TestTriangle.HOA.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly TicketCommandHandler _ticketCommandHandler;
        private readonly TicketQueryHandler _ticketQueryHandler;

        public TicketController(TicketCommandHandler ticketCommandHandler,
                                TicketQueryHandler ticketQueryHandler)
        {
            _ticketCommandHandler = ticketCommandHandler;
            _ticketQueryHandler = ticketQueryHandler;
        }

        // GET: api/Ticket/1
        [HttpGet("GetCustomerTickets/{customerId}")]
        public async Task<ActionResult<QueryResponse<QueryTicketModel>>> GetTicketsByCustomer(int customerId, int page, int pageSize)
        {
            var query = new GetCustomerTicketsQuery(customerId, page, pageSize)
            {
                CustomerId = customerId
            };
            var tickets = _ticketQueryHandler.HandleAsync(query);
            return tickets;
        }

        // GET: api/Ticket/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QuerySingleResponse<QueryTicketModel>>> GetTicket(int id)
        {
            var query = new FindQuery<QueryTicketModel>()
            {
                Id = id
            };
            var ticket = await _ticketQueryHandler.HandleAsync(query);

            if (ticket == null)
            {
                return NotFound(new { message = "Ticket not found" });
            }
            var response = new QuerySingleResponse<QueryTicketModel>();
            response.Data = ticket;
            response.Success = true;
            return response;
        }

        // PUT: api/Ticket/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Response<QueryTicketModel>>> PutTicket(int id, CommandTicketModel ticket)
        {
            try
            {
                var command = new UpdateCommand<CommandTicketModel>()
                {
                    Id = id,
                    Data = ticket
                };
                bool result = await _ticketCommandHandler.HandleAsync(command);

                if (!result)
                {
                    return NotFound(new { message = "Ticket not found" });
                }
                var response = new Response<QueryTicketModel>();
                response.Success = result;
                return response;
            }
            catch (Exception ex)
            {
                // log ex as exception
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        // POST: api/Ticket
        [HttpPost]
        public async Task<ActionResult<QuerySingleResponse<QueryTicketModel>>> PostTicket(CommandTicketModel ticket)
        {
            var command = new InsertCommand<CommandTicketModel>()
            {
                Data = ticket
            };
            var data = await _ticketCommandHandler.HandleAsync(command);
            var response = new QuerySingleResponse<QueryTicketModel>();
            response.Data = data;
            response.Success = true;
            return CreatedAtAction("GetTicket", new { id = data.TicketId }, response);
        }

        // DELETE: api/Ticket/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Response<QueryTicketModel>>> DeleteTicket(int id)
        {
            var command = new DeleteCommand()
            {
                Id = id
            };
            var isSuccess =  await _ticketCommandHandler.HandleAsync(command);
            var response = new Response<QueryTicketModel>();
            response.Success = isSuccess;
            return response;
        }

    }
}
