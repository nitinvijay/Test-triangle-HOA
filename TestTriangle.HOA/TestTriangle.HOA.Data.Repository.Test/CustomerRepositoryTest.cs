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
    public class CustomerRepositoryTest
    {
        private ICustomerRepository _repository;
        Mock<DbSet<Customer>> _mockCustomer;

        [TestInitialize]
        public void Init()
        {
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

            _repository = new CustomerRepository(mockContext.Object);
        }


        [TestMethod]
        public void GetCustomerTest()
        {
            var customers = _repository.GetCustomersAsync().Data;
            Assert.IsNotNull(customers);
            Assert.AreEqual(_mockCustomer.Object.Count(), customers.Count());
        }

        [TestMethod]
        public void GetCustomePagingTest()
        {
            var customers = _repository.GetCustomersAsync(0,0).Data;
            Assert.IsNotNull(customers);
            Assert.IsTrue(customers.Count() == 0);
        }


        [TestMethod]
        public void InsertCustomerTest()
        {
            _repository.InsertCustomerAsync(new CommandCustomerModel()).Wait();
            _mockCustomer.Verify(e => e.Add(It.IsAny<Customer>()), Times.Once);
        }

        [TestMethod]
        public void InsertCustomerTest_Exception()
        {
            var repository = new CustomerRepository(null);
            Assert.ThrowsException<AggregateException>(() => repository.InsertCustomerAsync(null).Result);
        }

        [TestMethod]
        [ExpectedException(typeof(AggregateException))]
        public void DeleteCustomerTest_Exception()
        {
            var repository = new CustomerRepository(null);
            repository.DeleteCustomerAsync(1).Wait();
        }

    }
}
