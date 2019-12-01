﻿using System;
using System.Collections.Generic;
using TestTriangle.HOA.Data.Models;

namespace TestTriangle.HOA.Data.Models
{
    public class CommandTicketModel : BaseModel
    {
        public int CustomerId { get; set; }
        public string Subject { get; set; }
        public string Category { get; set; }
        public DateTime IssueStartedOn { get; set; }
        public byte Status { get; set; }
        public string Description { get; set; }

    }

    public class QueryTicketModel : CommandTicketModel
    {
        public int TicketId { get; set; }        
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }

    }
}
