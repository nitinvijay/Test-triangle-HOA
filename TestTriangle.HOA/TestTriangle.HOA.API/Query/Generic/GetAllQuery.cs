using System;
using System.Collections.Generic;
using System.Text;
using TestTriangle.HOA.Data.Models;
using System.Linq;
using System.ComponentModel;
using TestTriangle.HOA.Extensions.Extension;
using Newtonsoft.Json;

namespace TestTriangle.HOA.API.Query.Generic
{
    public class GetAllQuery<T> where T : BaseModel
    {
        public GetAllQuery(int page, int pageSize, string orderBy, string dir, string filter)
        {
            this.Page = page;
            this.PageSize = pageSize;
            this.OrderBy = Convert.ToString(orderBy ?? "").Trim();
            this.Dir = Convert.ToString(dir ?? "").Trim();
            this.Filter = Convert.ToString(filter ?? "").Trim();
            if (this.Page == 0)
            {
                this.Page = 1;
            }
            if (this.PageSize == 0)
            {
                this.PageSize = 50;
            }
            this.ValidateRequest();
        }

        public int Page { get; set; }
        public int PageSize { get; set; }
        public string OrderBy { get; set; }
        public string Dir { get; set; }
        public string Filter { get; set; }
        public List<SearchParams> Filters { get; set; }

        private void ValidateRequest()
        {
            bool hasError = false;
            int stepIndex = 1;
            int steps = 3;
            var props = new List<PropertyDescriptor>();
            while (!hasError && stepIndex <= steps)
            {
                switch (stepIndex)
                {
                    case 1: // Validate Sort Directions
                        var sortDirections = new List<string>() { "asc", "desc" };
                        hasError = !sortDirections.Any(a => a == Convert.ToString(this.Dir).ToLower());
                        break;
                    case 2: // Validate Sort Property
                        props = TypeDescriptor.GetProperties(typeof(T)).OfType<PropertyDescriptor>().ToList();
                        var prop = props.FirstOrDefault(a => a.Name.ToLower() == Convert.ToString(this.OrderBy).ToLower());
                        hasError = prop == null; // !props.Any(a => a.Name.ToLower() == Convert.ToString(this.OrderBy).ToLower());
                        if (!hasError)
                        {
                            this.OrderBy = prop.Name;
                        }
                        break;
                    case 3: // Validate Filters Property
                        if (!string.IsNullOrEmpty(this.Filter))
                        {
                            this.Filters = JsonConvert.DeserializeObject<List<SearchParams>>(this.Filter);
                            if (this.Filters != null && this.Filters.Any())
                            {
                                hasError = !this.Filters.All(a => props.Any(p => p.Name.ToLower() == Convert.ToString(a.PropertyName).ToLower()));
                                if (!hasError)
                                {
                                    this.Filters.ForEach(f =>
                                    {
                                        f.PropertyName = props.FirstOrDefault(p => p.Name.ToLower() == Convert.ToString(f.PropertyName).ToLower()).Name;
                                    });
                                }
                            }
                        }
                        break;
                }
                stepIndex++;
            }

            if (hasError)
            {
                throw new Exception("Bad oData request");
            }
        }
    }
}
