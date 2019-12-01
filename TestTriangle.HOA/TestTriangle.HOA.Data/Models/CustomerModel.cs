using System;
using System.Collections.Generic;

namespace TestTriangle.HOA.Data.Models
{
    public class CommandCustomerModel : BaseModel
    {   
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
        public string Phone { get; set; }
    }
    public class QueryCustomerModel : CommandCustomerModel
    {
        public int CustomerId { get; set; }
        public bool IsActive { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int CreatedBy { get; set; }

    }
}
