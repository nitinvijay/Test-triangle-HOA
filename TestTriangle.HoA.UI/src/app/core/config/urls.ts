
// const baseURL = 'https://localhost:44328';
const baseURL = 'https://testtrianglehoa.azurewebsites.net';
export let URLs = {
    customer: {
      all: `${baseURL}/api/Customer`,
      getTickets: `${baseURL}/api/Ticket/GetCustomerTickets`
    },
    customerTicket: {
      all: `${baseURL}/api/CustomerTicket`
    },
    ticket: {
      all: `${baseURL}/api/Ticket`
    },
    common: {
      getCountries: `${baseURL}/api/Common/getcountries`,
      getStatus: `${baseURL}/api/Common/getstatus`
    }
}
