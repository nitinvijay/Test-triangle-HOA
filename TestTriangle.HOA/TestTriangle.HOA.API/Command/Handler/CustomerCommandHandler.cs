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
    public class CustomerCommandHandler
    {
        private readonly IUnitOfWork _unitOfWork;
        public CustomerCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<QueryCustomerModel> HandleAsync(InsertCommand<CommandCustomerModel> insertCommand)
        {
            return await _unitOfWork.CustomerRepository.InsertCustomerAsync(insertCommand.Data);
        }

        public async Task<bool> HandleAsync(UpdateCommand<CommandCustomerModel> updateCommand)
        {
            return await _unitOfWork.CustomerRepository.UpdatCustomerAsync(updateCommand.Id, updateCommand.Data);
        }

        public async Task<bool> HandleAsync(DeleteCommand deleteCommand)
        {
            return await _unitOfWork.CustomerRepository.DeleteCustomerAsync(deleteCommand.Id);
        }

    }
}
