using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TestTriangle.HOA.API.Query.Generic;
using TestTriangle.HOA.Data.Repository.Contracts;
using TestTriangle.HOA.Data.Repository.Implementation;
using TestTriangle.HOA.Data.Models;

namespace TestTriangle.HOA.API.Query.Handler
{
    public class TicketQueryHandler
    {
        private readonly IUnitOfWork _unitOfWork;
        public TicketQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public QueryResponse<QueryTicketModel> HandleAsync(GetCustomerTicketsQuery getCustomerTicketsQuery)
        {
            return _unitOfWork.TicketRepository.GetTicketsAsync(getCustomerTicketsQuery.CustomerId, getCustomerTicketsQuery.Page, getCustomerTicketsQuery.PageSize);
        }

        public async Task<QueryTicketModel> HandleAsync(FindQuery<QueryTicketModel> findQuery)
        {
            return await _unitOfWork.TicketRepository.FindTicketAsync(findQuery.Id);
        }

    }

}
