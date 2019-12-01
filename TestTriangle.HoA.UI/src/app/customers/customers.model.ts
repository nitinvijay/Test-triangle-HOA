import { BaseGridDataView } from '../shared/components/gridview/gridview.model';


export class Customers extends BaseGridDataView {
  customerId: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  state: string;
  postalCode: string;
  phone: string;
}

export class Ticket extends BaseGridDataView  {
  ticketId: number;
  customerId: number;
  subject: string;
  category: number;
  status: number;
  description: string;
  issueStartedOn: Date;
  createdOn: Date;
  createdBy: string;
}
export class CustomersTicket extends Customers {
  tickets: Ticket[];
}
