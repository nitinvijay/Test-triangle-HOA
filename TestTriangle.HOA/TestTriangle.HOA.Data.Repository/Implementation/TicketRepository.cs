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
    public class TicketRepository : ITicketRepository
    {
        TestTriangleHOAContext _context;
        ISpProvider _spProvider;

        public TicketRepository(TestTriangleHOAContext context)
        {
            _context = context;
            _spProvider = new SpProvider(_context);
        }

        public TicketRepository()
        {
            _context = new TestTriangleHOAContext();
        }

        public async Task<IList<Ticket>> GetTicketsAsync(int customerId) =>
            await _context.Ticket.Where(t => t.CustomerId == customerId).ToListAsync();

        public QueryResponse<QueryTicketModel> GetTicketsAsync(int customerId, int page = 1, int pageSize = 50)
        {
            //var data =
            //_context.Ticket.AsQueryable()
            //.Where(t => t.CustomerId == customerId)
            //.OrderByDescending(o => o.CreatedBy)
            //.Skip(page > 1 ? (page - 1) * pageSize : 0)
            //.Take(pageSize);

            var count = _context.Ticket.Where(t => t.CustomerId == customerId).Count();
            var data = this._spProvider.ExecutelstSql<QueryTicketModel>("usp_GetCustomerTickets", new { customerId }, new { page }, new { pageSize });

            return new QueryResponse<QueryTicketModel>()
            {
                Data = data.AsList<QueryTicketModel>(),
                TotalCount = count,
                Success = true
            };
        }

        public async Task<QueryTicketModel> FindTicketAsync(int id)
        {
            return _context.Ticket.FindAsync(id).Result.TO<QueryTicketModel>();
        }

        public async Task<QueryTicketModel> InsertTicketAsync(CommandTicketModel ticket)
        {
            try
            {
                var ticketEntity = ticket.TO<Ticket>();
                ticketEntity.CreatedOn = DateTime.Now;
                _context.Ticket.Add(ticketEntity);
                await _context.SaveChangesAsync();
                return ticketEntity.TO<QueryTicketModel>();
            }
            catch (Exception ex)
            {
                throw new Exception("Something went wrong, please contact system administrator.");
            }
        }

        public async Task<bool> UpdatTicketAsync(int id, CommandTicketModel ticket)
        {
            var ticketEntity = await _context.Ticket.FindAsync(id);
            if (ticketEntity != null)
            {
                ticketEntity.IssueStartedOn = ticket.IssueStartedOn;
                ticketEntity.Status = ticket.Status;
                ticketEntity.Subject = ticket.Subject;
                ticketEntity.Category = ticket.Category;
                ticketEntity.CustomerId = ticket.CustomerId;
                ticketEntity.Description = ticket.Description;
                _context.Entry(ticketEntity).State = EntityState.Modified;
            }
            else
            {
                throw new Exception("Ticket does not exists.");
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

        public async Task<bool> DeleteTicketAsync(int id)
        {
            var ticket = await _context.Ticket.FindAsync(id);
            if (ticket == null)
            {
                throw new Exception("Ticket does not exists.");
            }
            try
            {
                _context.Ticket.Remove(ticket);
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
