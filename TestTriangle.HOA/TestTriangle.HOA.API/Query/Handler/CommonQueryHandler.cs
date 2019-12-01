using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestTriangle.HOA.API.Query.Generic;
using TestTriangle.HOA.Data.Models;
using TestTriangle.HOA.Data.Repository.Contracts;
using TestTriangle.HOA.Data.Repository.Implementation;

namespace TestTriangle.HOA.API.Query.Handler
{
    public class CommonQueryHandler
    {
        private readonly IUnitOfWork _unitOfWork;
        public CommonQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public QueryResponse<Dropdown> GetCountries()
        {
            return _unitOfWork.CommonRepository.GetCountries();
        }

        public QueryResponse<Dropdown> GetStatus()
        {
            return _unitOfWork.CommonRepository.GetStatus();
        }

    }

}
