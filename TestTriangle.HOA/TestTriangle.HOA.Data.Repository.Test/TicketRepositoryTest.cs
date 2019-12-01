using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestTriangle.HOA.Common;
using TestTriangle.HOA.Data.Context;
using TestTriangle.HOA.Data.Context.Entity;
using TestTriangle.HOA.Data.Models;
using TestTriangle.HOA.Data.Repository.Contracts;
using TestTriangle.HOA.Data.Repository.Implementation;

namespace TestTriangle.HOA.Data.Repository.Test
{
    [TestClass]
    public class TicketRepositoryTest
    {
        private ITicketRepository _repository;
        Mock<DbSet<Ticket>> _mockTicket;

        [TestInitialize]
        public void Init()
        {
            var tickets = new List<Ticket>()
            {
                new Ticket()
                {
                    CustomerId = 1,
                    TicketId = 1,
                    Category = "Category1",
                    Description = "Test description",
                    IssueStartedOn = DateTime.Now,
                    Status = 1,
                    Subject = "Subject 1",
                    CreatedBy = 100,
                    CreatedOn = DateTime.Now
                },
                new Ticket()
                {
                    CustomerId = 1,
                    TicketId = 2,
                    Category = "Category2",
                    Description = "Test description111",
                    IssueStartedOn = DateTime.Now,
                    Status = 1,
                    Subject = "Subject 2",
                    CreatedBy = 100,
                    CreatedOn = DateTime.Now
                }

            }.AsQueryable();

            _mockTicket = new Mock<DbSet<Ticket>>();
            _mockTicket.As<IQueryable<Ticket>>().Setup(m => m.Provider).Returns(tickets.Provider);
            _mockTicket.As<IQueryable<Ticket>>().Setup(m => m.Expression).Returns(tickets.Expression);
            _mockTicket.As<IQueryable<Ticket>>().Setup(m => m.ElementType).Returns(tickets.ElementType);
            _mockTicket.As<IQueryable<Ticket>>().Setup(m => m.GetEnumerator()).Returns(tickets.GetEnumerator());

            var mockContext = new Mock<TestTriangleHOAContext>();
            mockContext.Setup(c => c.Ticket).Returns(_mockTicket.Object);

            _repository = new TicketRepository(mockContext.Object);
        }


        [TestMethod]
        public void GetTicketTest()
        {
            var tickets = _repository.GetTicketsAsync(1).Data;
            Assert.IsNotNull(tickets);
            Assert.AreEqual(_mockTicket.Object.Count(), tickets.Count());
        }

        [TestMethod]
        public void GetTicketsPagingTest()
        {
            var tickets = _repository.GetTicketsAsync(0,0).Data;
            Assert.IsNotNull(tickets);
            Assert.IsTrue(tickets.Count() == 0);
        }


        [TestMethod]
        public void InsertTicketTest()
        {
            _repository.InsertTicketAsync(new QueryTicketModel()).Wait();
            _mockTicket.Verify(e => e.Add(It.IsAny<Ticket>()), Times.Once);
        }

        [TestMethod]
        public void InsertTikcetTest_Exception()
        {
            var repository = new TicketRepository(null);
            Assert.ThrowsException<AggregateException>(() => repository.InsertTicketAsync(null).Result);
        }

        [TestMethod]
        [ExpectedException(typeof(AggregateException))]
        public void DeleteTicketTest_Exception()
        {
            var repository = new TicketRepository(null);
            repository.DeleteTicketAsync(1).Wait();
        }

    }
}
