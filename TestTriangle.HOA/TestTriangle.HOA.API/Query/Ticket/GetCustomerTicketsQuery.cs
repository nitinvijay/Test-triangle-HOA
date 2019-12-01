using System;
using System.Collections.Generic;
using System.Text;

namespace TestTriangle.HOA.API.Query
{
    public class GetCustomerTicketsQuery
    {
        public int CustomerId { get; set; }

        public GetCustomerTicketsQuery(int customerId, int page = 1, int pageSize = 50)
        {
            this.Page = page;
            this.PageSize = pageSize;
            this.CustomerId = customerId;

            if (this.Page == 0)
            {
                this.Page = 1;
            }
            if (this.PageSize == 0)
            {
                this.PageSize = 50;
            }
        }

        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
