using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using TestTriangleHOA.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using TestTriangleHOA.Web.Service;
using Microsoft.AspNetCore.Authorization;
using System.Diagnostics;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TestTriangleHOA.Web.Controllers
{
    [Authorize]
    public class CustomerController : Controller
    {
        private RestService _restService;

        public CustomerController(RestService restService)
        {
            _restService = restService;
        }

        // GET: /<controller>/
        public IActionResult Index(int page = 1, int pageSize = 50)
        {
            var result = _restService.SendAsync<BaseResponse<QueryCustomerModel>>($"api/Customer?page={page}&pageSize={pageSize}&orderBy=firstname&dir=asc&filter=null", HttpMethod.Get);
            return View(result);
        }

        public ActionResult CreateCustomer()
        {
            return View(new QueryCustomerModel());
        }

        [HttpPost]
        public ActionResult CreateCustomer(CommandCustomerModel customer)
        {
            if (ModelState.IsValid)
            {
                _restService.SendAsync<CommandCustomerModel>("api/Customer", HttpMethod.Post, customer);
                return RedirectToAction("Index", "Customer");
            }
            return View(customer);
        }

        //[HttpDelete]
        public ActionResult Delete(int id)
        {
            var response = _restService.SendAsync<Response<QueryCustomerModel>>($"api/Customer/{id}", HttpMethod.Delete);
            //Redirect to list page with refresh data
            return RedirectToAction("Index", "Customer");
        }

        public ActionResult UpdateCustomer(int id)
        {
            var result = _restService.SendAsync<QuerySingleResponse<QueryCustomerModel>>($"api/Customer/{id}", HttpMethod.Get);
            if (result == null)
            {
                return View(new QuerySingleResponse<QueryCustomerModel>().Data);
            }

            return View(result.Data);
        }

        [HttpPost]
        public ActionResult UpdateCustomer(int id, CommandCustomerModel customer)
        {
            if (ModelState.IsValid)
            {
                _restService.SendAsync<Response<QueryCustomerModel>>($"api/Customer/{id}", HttpMethod.Put, customer);
                return RedirectToAction("Index", "Customer");
            }
            return View(customer);
        }

    }
}
