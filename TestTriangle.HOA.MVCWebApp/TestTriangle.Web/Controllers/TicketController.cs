using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using TestTriangleHOA.Web.Models;
using TestTriangleHOA.Web.Service;

namespace TestTriangleHOA.Web.Controllers
{
    public class TicketController : Controller
    {
        private RestService _restService;

        public TicketController(RestService restService)
        {
            _restService = restService;
        }

        // GET: /<controller>/
        public IActionResult Index([FromQuery]int customerId, [FromQuery]int page = 1, [FromQuery]int pageSize = 50)
        {
            var result = _restService.SendAsync<QueryResponse<QueryTicketModel>>($"api/Ticket/GetCustomerTickets/{customerId}?page={page}&pageSize={pageSize}", HttpMethod.Get);
            ViewBag.Customer = GetCustomer(customerId).Data;
            return View(result);
        }

        public ActionResult CreateTicket()
        {
            var customers = GetCustomers().Data;
            ViewBag.Customers = customers.Select(s => new SelectListItem() { Text = $"{s.FirstName} {s.LastName}", Value = s.CustomerId.ToString() }).ToList();
            return View(new QueryTicketModel() { Status = 1, CreatedOn = DateTime.Now });
        }

        private BaseResponse<QueryCustomerModel> GetCustomers()
        {
            return _restService.SendAsync<BaseResponse<QueryCustomerModel>>($"api/Customer", HttpMethod.Get);
        }

        private QuerySingleResponse<QueryCustomerModel> GetCustomer(int id)
        {
            return _restService.SendAsync<QuerySingleResponse<QueryCustomerModel>>($"api/Customer/{id}", HttpMethod.Get);
        }

        [HttpPost]
        public ActionResult CreateTicket(CommandTicketModel ticket)
        {
            if (ModelState.IsValid)
            {
                _restService.SendAsync<CommandTicketModel>("api/Ticket", HttpMethod.Post, ticket);
                return RedirectToAction("Index", "Ticket", new { customerId = ticket.CustomerId });
            }
            return View(ticket);
        }

        [HttpDelete]
        public IActionResult Delete(int id, int customerId)
        {
            var response = _restService.SendAsync<Response<QueryTicketModel>>($"api/Ticket/{id}", HttpMethod.Delete);
            //Redirect to list page with refresh data
            return RedirectToAction("Index", "Ticket", new { customerId = customerId });
        }

        public ActionResult UpdateTicket(int id, int customerId)
        {
            var result = _restService.SendAsync<QuerySingleResponse<QueryTicketModel>>($"api/Ticket/{id}", HttpMethod.Get);
            if (result == null)
            {
                return View(new QueryTicketModel() { CustomerId = customerId });
            }

            return View(result.Data);
        }

        [HttpPost]
        public ActionResult UpdateTicket(int id, CommandTicketModel ticket)
        {
            if (ModelState.IsValid)
            {
                _restService.SendAsync<CommandTicketModel>($"api/Ticket/{id}", HttpMethod.Put, ticket);
                return RedirectToAction("Index", "Ticket", new { customerId = ticket.CustomerId });
            }
            return View(ticket);
        }
    }
}