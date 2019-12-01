using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TestTriangle.HOA.API.Command.Handler;
using TestTriangle.HOA.API.Controllers;
using TestTriangle.HOA.API.Query.Generic;
using TestTriangle.HOA.API.Query.Handler;
using TestTriangle.HOA.Data;
using TestTriangle.HOA.Data.Context;
using TestTriangle.HOA.Data.Context.Entity;
using TestTriangle.HOA.Data.Models;
using TestTriangle.HOA.Data.Repository.Contracts;
using TestTriangle.HOA.Data.Repository.Implementation;

namespace TestTriangle.HOA.API.Test
{
    [TestClass]
    public class CustomerControllerTest
    {
        public Mock<IUnitOfWork> _mockUnitOfWork;
        public Mock<CustomerRepository> _mockrepository;
        public Mock<CustomerCommandHandler> _mockCommandHandler;
        public Mock<CustomerQueryHandler> _mockQueryHandler;
        Mock<DbSet<Customer>> _mockCustomer;

        [TestInitialize]
        public void Init()
        {
            _mockUnitOfWork = new Mock<IUnitOfWork>();

            var customers = new List<Customer>()
            {
                new Customer()
                {
                    CustomerId = 1,
                    Address = "Address123",
                    City = "City1",
                    Country = "County1",
                    CreatedBy = 100,
                    CreatedOn = DateTime.Now,
                    FirstName = "Firstname1",
                    LastName = "Lastname1",
                    IsActive = true,
                    Phone = "123456789",
                    PostalCode = "882244",
                    State = "State1"
                },
                new Customer()
                {
                    CustomerId = 2,
                    Address = "Address1234",
                    City = "City2",
                    Country = "County2",
                    CreatedBy = 200,
                    CreatedOn = DateTime.Now,
                    FirstName = "Firstname2",
                    LastName = "Lastname2",
                    IsActive = true,
                    Phone = "123456788",
                    PostalCode = "882243",
                    State = "State2"
                }
            }.AsQueryable();

            _mockCustomer = new Mock<DbSet<Customer>>();
            _mockCustomer.As<IQueryable<Customer>>().Setup(m => m.Provider).Returns(customers.Provider);
            _mockCustomer.As<IQueryable<Customer>>().Setup(m => m.Expression).Returns(customers.Expression);
            _mockCustomer.As<IQueryable<Customer>>().Setup(m => m.ElementType).Returns(customers.ElementType);
            _mockCustomer.As<IQueryable<Customer>>().Setup(m => m.GetEnumerator()).Returns(customers.GetEnumerator());

            var mockContext = new Mock<TestTriangleHOAContext>();
            mockContext.Setup(c => c.Customer).Returns(_mockCustomer.Object);

            _mockCommandHandler = new Mock<CustomerCommandHandler>(_mockUnitOfWork.Object);
            _mockQueryHandler = new Mock<CustomerQueryHandler>(_mockUnitOfWork.Object);
        }

        [TestMethod]
        public void GetCustomersTest()
        {
            //var mockRepository = new Mock<ICustomerRepository>();
            //var customers = new List<Customer>();
            //customers.Add(new Customer() { CustomerId = 1 });
            //mockRepository.Setup(foo => foo.GetCustomersAsync(It.IsAny<int>(), It.IsAny<int>()))
            //                   .Returns(new BaseResponse<Customer>() { Data = customers.AsQueryable(), Errors = null, Success = true });
            ////_mockQueryHandler.Setup(foo => foo.HandleAsync(It.IsAny<GetAllQuery<>>))
            //var controller = new CustomerController(_mockCommandHandler.Object, _mockQueryHandler.Object);
            //var response = controller.GetCustomers(1, 10);

        }

    }
}
