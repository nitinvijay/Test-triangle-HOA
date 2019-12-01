using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TestTriangle.HOA.API.Command.Generic;
using TestTriangle.HOA.Data.Models;
using TestTriangle.HOA.Data.Repository.Contracts;
using TestTriangle.HOA.Data.Repository.Implementation;

namespace TestTriangle.HOA.API.Command.Handler
{
    public class TicketCommandHandler
    {
        private readonly IUnitOfWork _unitOfWork;
        public TicketCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<QueryTicketModel> HandleAsync(InsertCommand<CommandTicketModel> insertCommand)
        {
            return await _unitOfWork.TicketRepository.InsertTicketAsync(insertCommand.Data);
        }

        public async Task<bool> HandleAsync(UpdateCommand<CommandTicketModel> updateCommand)
        {
            return await _unitOfWork.TicketRepository.UpdatTicketAsync(updateCommand.Id, updateCommand.Data);
        }

        public async Task<bool> HandleAsync(DeleteCommand deleteCommand)
        {
            return await _unitOfWork.TicketRepository.DeleteTicketAsync(deleteCommand.Id);
        }

    }
}
