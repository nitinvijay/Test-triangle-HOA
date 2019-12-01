using System;
using System.Collections.Generic;
using System.Text;

namespace TestTriangle.HOA.Data.Models
{
    public class CommandCustomerTicketModel : CommandCustomerModel
    {
        public List<CommandTicketModel> Tickets { get; set; }

    }
}
