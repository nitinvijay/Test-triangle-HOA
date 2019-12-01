using System;
using System.Collections.Generic;
using System.Text;
using TestTriangle.HOA.Data.Context;
using TestTriangle.HOA.Data.Repository.Contracts;
using TestTriangle.HOA.Data.Repository.Implementation;

namespace TestTriangle.HOA.Data.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private TestTriangleHOAContext _context;
        private ICustomerRepository _customerRepository;
        private ITicketRepository _ticketRepository;
        private ICommonRepository _commonRepository;

        public UnitOfWork(TestTriangleHOAContext context)
        {
            this._context = context;
        }

        public UnitOfWork()
        {
            this._context = new TestTriangleHOAContext();
        }

        public ICustomerRepository CustomerRepository
        {
            get
            {
                if (this._customerRepository == null)
                {
                    this._customerRepository = new CustomerRepository(_context);
                }
                return _customerRepository;
            }
        }

        public ITicketRepository TicketRepository
        {
            get
            {
                if (this._ticketRepository == null)
                {
                    this._ticketRepository = new TicketRepository(_context);
                }
                return _ticketRepository;
            }
        }

        public ICommonRepository CommonRepository
        {
            get
            {
                if (this._commonRepository == null)
                {
                    this._commonRepository = new CommonRepository(_context);
                }
                return _commonRepository;
            }
        }


        public void Save()
        {
            try
            {
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception("Error in saving changes to DB:" + ex.Message);
            }
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
