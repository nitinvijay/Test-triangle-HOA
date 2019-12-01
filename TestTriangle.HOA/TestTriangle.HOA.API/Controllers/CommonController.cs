using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestTriangle.HOA.API.Command.Generic;
using TestTriangle.HOA.API.Command.Handler;
using TestTriangle.HOA.API.Model;
using TestTriangle.HOA.API.Query.Generic;
using TestTriangle.HOA.API.Query.Handler;
using TestTriangle.HOA.Data.Models;

namespace TestTriangle.HOA.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class CommonController : ControllerBase
    {
        private readonly CommonQueryHandler _commonQueryHandler;

        public CommonController(CommonQueryHandler commonQueryHandler)
        {
            _commonQueryHandler = commonQueryHandler;

        }

        // GET: api/common/getcountries
        [HttpGet("getcountries")]
        public async Task<ActionResult<QueryResponse<Dropdown>>> GetCountries()
        {
            var response = _commonQueryHandler.GetCountries();
            return response;
        }

        // GET: api/common/GetStatus
        [HttpGet("getstatus")]
        public async Task<ActionResult<QueryResponse<Dropdown>>> GetStatus()
        {
            var response = _commonQueryHandler.GetStatus();
            return response;
        }
    }
}
