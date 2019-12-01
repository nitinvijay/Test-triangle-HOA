import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BaseResponse } from '../shared/models/common.model';
import { Customers, Ticket, CustomersTicket } from './customers.model';
import { URLs } from '../core/config/urls';
import { ODataGrid } from '../shared/components/gridview/gridview.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private httpService: HttpClient) { }


  getCustomers(oData: ODataGrid
  ): Observable<BaseResponse<Customers>> {
    return this.httpService.get<BaseResponse<Customers>>(
      `${URLs.customer.all}`,
      {
        params: {
          page: `${oData.Page}`,
          pageSize: `${oData.PageSize}`,
          orderBy: `${oData.SortBy}`,
          dir: `${oData.SortByOrder}`,
          filter: `${JSON.stringify(oData.Filters)}`,
        }
      }
    );
  }

  getCustomerTickets(customerId: number, oData: ODataGrid): Observable<BaseResponse<Ticket>> {
    return this.httpService.get<BaseResponse<Ticket>>(
      `${URLs.customer.getTickets}/${customerId}`,
      {
        params: {
          page: `${oData.Page}`,
          pageSize: `${oData.PageSize}`
        }
      }
    );
  }

  postCustomer(customer: CustomersTicket): Observable<any> {
    return this.httpService.post<CustomersTicket>(`${URLs.customerTicket.all}`, customer);
  }

  putCustomer(customer: Customers): Observable<any> {
    return this.httpService.put<any>(`${URLs.customer.all}/${customer.customerId}`, customer);
  }

  deleteCustomer(customerId: number): Observable<BaseResponse<any>> {
    return this.httpService.delete<BaseResponse<any>>(`${URLs.customer.all}/${customerId}`);
  }

  postTicket(ticket: Ticket): Observable<any> {
    return this.httpService.post<Ticket>(`${URLs.ticket.all}`, ticket);
  }

  putTicket(ticket: Ticket): Observable<any> {
    return this.httpService.put<any>(`${URLs.ticket.all}/${ticket.ticketId}`, ticket);
  }

  deleteTicket(ticketId: number): Observable<BaseResponse<any>> {
    return this.httpService.delete<BaseResponse<any>>(`${URLs.ticket.all}/${ticketId}`);
  }

}
