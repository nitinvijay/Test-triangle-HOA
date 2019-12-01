using System;
using System.Collections.Generic;

namespace TestTriangle.HOA.Data.Context.Entity
{
    public partial class Ticket
    {
        public int TicketId { get; set; }
        public int CustomerId { get; set; }
        public string Subject { get; set; }
        public string Category { get; set; }
        public DateTime IssueStartedOn { get; set; }
        public byte Status { get; set; }
        public string Description { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }

    }
}
