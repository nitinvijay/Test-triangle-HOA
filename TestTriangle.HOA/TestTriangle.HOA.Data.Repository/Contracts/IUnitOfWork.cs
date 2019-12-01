using System;
using System.Collections.Generic;
using System.Text;

namespace TestTriangle.HOA.Data.Repository.Contracts
{
    public interface IUnitOfWork : IDisposable
    {
        ICustomerRepository CustomerRepository { get; }
        ITicketRepository TicketRepository { get; }
        ICommonRepository CommonRepository { get; }
        void Save();
    }
}
