using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TestTriangle.HOA.Data.Context.Entity;
using TestTriangle.HOA.Data.Models;

namespace TestTriangle.HOA.Data.Repository.Contracts
{
    public interface ITicketRepository
    {
        Task<IList<Ticket>> GetTicketsAsync(int customerId);
        QueryResponse<QueryTicketModel> GetTicketsAsync(int customerId, int page = 1, int pageSize = 50);
        Task<QueryTicketModel> FindTicketAsync(int id);
        Task<QueryTicketModel> InsertTicketAsync(CommandTicketModel ticket);
        Task<bool> UpdatTicketAsync(int id, CommandTicketModel ticket);
        Task<bool> DeleteTicketAsync(int id);

    }
}
