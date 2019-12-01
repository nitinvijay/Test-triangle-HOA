import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  GridDataView,
  BaseGridDataView,
  Formatter,
  Columns,
  ODataGrid
} from '../shared/components/gridview/gridview.model';
import {
  Customers,
  Ticket
} from './customers.model';
import {
  Subject,
  Subscription
} from 'rxjs';
import {
  CustomersService
} from './customers.service';
import {
  BaseResponse, DropdownModel
} from '../shared/models/common.model';
import {
  CommonUtility
} from '../shared/utils/common.utility';
import {
  IResolveEmit
} from '../core/components/global-confirmation/global-confirmation.model';
import {
  GlobalConfirmationService
} from '../core/components/global-confirmation/global-confirmation.service';
import {
  GlobalToasterService
} from '../core/components/global-toaster/global-toaster.service';
import {
  GlobalToasterType
} from '../core/components/global-toaster/global-toaster.model';
import { CommonDataService } from '../core/services/common-data.service';
import { Config } from '../core/config/app-config';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit, OnDestroy {

  /** Properties */
  subscriber: Subscription = new Subscription();
  isLoading: boolean = false;
  customer: Customers;
  manageCustomerVisible: boolean = false;
  ticket: Ticket;
  ticketCustomerIndex: number = -1;
  manageTicketVisible: boolean = false;
  statusList: DropdownModel[];
  CustomerGridData: Customers[];
  gridData: GridDataView < Customers > ;
  customerOData: ODataGrid;
  rowExpander: Subject < BaseGridDataView > = new Subject < BaseGridDataView > ();
  CustomerHeaders: Columns[] = [
    { hasFilter: true, hasSort: true, header: 'FirstName' },
    { hasFilter: true, hasSort: true, header: 'LastName' },
    { hasFilter: false, hasSort: true, header: 'Address' },
    { hasFilter: false, hasSort: true, header: 'Country' },
    { hasFilter: false, hasSort: true, header: 'State' },
    { hasFilter: false, hasSort: true, header: 'PostalCode' },
    { hasFilter: false, hasSort: true, header: 'Phone' }] as Columns[];
  TicketHeaders: Columns[] = [
    { hasFilter: false, hasSort: false, header: 'Subject' },
    { hasFilter: false, hasSort: false, header: 'Category' },
    { hasFilter: false, hasSort: false, header: 'Status' },
    { hasFilter: false, hasSort: false, header: 'Description' },
    { hasFilter: false, hasSort: false, header: 'CreatedOn' }] as Columns[];

  constructor(private customersService: CustomersService, private confirmationService: GlobalConfirmationService,
    private toasterService: GlobalToasterService, private commonDataService: CommonDataService) {

  }

  ngOnInit() {
    const statusSub = this.commonDataService.getStatus().subscribe(s => {
      this.statusList = s.data;
    });
    this.subscriber.add(statusSub);
    this.loadCustomersGrid(true);
  }

  loadCustomersGrid(isReload = false) {
    if (!this.isLoading) {
      if (isReload) {
        this.setUpGrid();
      }
      this.isLoading = true;
      this.customersService
        .getCustomers(this.gridData.oData)
        .subscribe((res: BaseResponse < Customers > ) => {
          this.isLoading = false;
          if (res.success) {
            this.CustomerGridData = res.data;
            this.transformToGridData < Customers > (this.CustomerGridData, this.gridData,
              this.gridData.oData.Page, this.gridData.oData.PageSize, res.totalCount);
          }
        });
    }
  }

  /** Grid Section */
  setUpGrid() {
    const customerOData = new ODataGrid();
    customerOData.Page = 1;
    customerOData.PageSize = Config.gridPageSize;
    customerOData.SortBy = 'FirstName';
    customerOData.SortByOrder = 'asc';
    customerOData.Filters = [];
    const scope = this;
    this.gridData = new GridDataView < Customers > ();
    this.gridData.oData = customerOData;
    this.gridData.Headers = this.CustomerHeaders;
    this.gridData.CellFormatter = new Formatter < Customers > ();
    this.gridData.hasEdit = true;
    this.gridData.hasDelete = true;
    this.gridData.hasChildGrid = true;
    this.gridData.onEdit = this.onCustomerEdit.bind(scope);
    this.gridData.onDelete = this.onCustomerDelete.bind(scope);
    this.gridData.onODataChange = this.customerODataChange.bind(this);
    this.gridData.childRowLoader = this.childRowLoader.bind(scope);
    this.CustomerHeaders.forEach(m => {
      this.gridData.CellFormatter[m.header] = this.formatCustomerCell.bind(scope);
    });
    this.gridData.Body = [];
    this.gridData.Data = [];
  }

  formatCustomerCell(prop: string, data: Customers): string {
    prop = `${prop.substring(0, 1).toLowerCase()}${prop.substring(1)}`;
    if (data[prop]) {
      switch (prop) {
        case 'dOB':
          return CommonUtility._formatDate(new Date(data[prop]), 'MM/dd/yyyy');
        default:
          return data[prop].toString();
      }
    }
    return '';
  }

  customerODataChange(oData: ODataGrid, row: BaseGridDataView): Promise<GridDataView<Customers>> {
    const scope = this;
    scope.isLoading = true;
    return new Promise < GridDataView < Customers >> ((resolve, reject) => {
      scope.customerOData = oData;
      scope.customersService.getCustomers(scope.customerOData).subscribe(res => {
        if (res && res.success) {
          scope.CustomerGridData = res.data;
          scope.transformToGridData < Customers > (res.data, scope.gridData, scope.customerOData.Page,
          scope.customerOData.PageSize, res.totalCount);
          scope.isLoading = false;
          resolve(scope.gridData);
        } else {
          resolve(scope.gridData);
        }
      });
    });
  }

  childRowLoader(row: Customers, rowIndex: number): Promise < GridDataView < Ticket >> {
    const scope = this;
    return new Promise < GridDataView < Ticket >> ((resolve, reject) => {
      const ticketOData = new ODataGrid();
      ticketOData.Page = 1;
      ticketOData.PageSize = Config.gridPageSize;
      ticketOData.SortBy = 'CreatedOn';
      ticketOData.SortByOrder = 'desc';
      ticketOData.Filters = [];
      const ticketGridData = scope.setUpTicketGrid(ticketOData);
      scope.customersService.getCustomerTickets(row.customerId, ticketOData).subscribe(res => {
        if (res && res.success) {
          scope.transformToGridData < Ticket > (res.data, ticketGridData, ticketGridData.oData.Page,
            ticketGridData.oData.PageSize, res.totalCount);
          scope.isLoading = false;
          resolve(ticketGridData);
        } else {
          resolve(ticketGridData);
        }
      });
    });
  }

  onCustomerEdit(event: Customers, parentRowIndex: number) {
    this.customer = event;
    this.ticketCustomerIndex = this.CustomerGridData.findIndex(f => f.customerId === event.customerId);
    this.manageCustomerVisible = true;
  }

  onCustomerDelete(event: Customers, parentRowIndex: number) {
    this.ticketCustomerIndex = parentRowIndex;
    this.confirmationService
      .showConfirmationMsg(
        'Do want to delete customer',
        'Delete Customer',
        `${event.firstName} ${event.lastName}`,
        'Delete'
      )
      .subscribe((confirm: IResolveEmit) => {
        this.isLoading = true;
        const subs = this.customersService
          .deleteCustomer(
            event.customerId
          )
          .subscribe((res: BaseResponse<any> ) => {
            this.isLoading = false;
            this.setCustomerDeleteMessage({
              success: res.success
            });

          });
        this.subscriber.add(subs);
      });
  }

  reloadTicketCustomer() {
    const customer = this.CustomerGridData[this.ticketCustomerIndex] as BaseGridDataView;
    customer.index = this.ticketCustomerIndex;
    this.rowExpander.next(customer);
  }

  setUpTicketGrid(ticketOData: ODataGrid): GridDataView < Ticket > {
    const scope = this;
    const gridData = new GridDataView < Ticket > ();
    gridData.Headers = this.TicketHeaders;
    gridData.oData = ticketOData;
    gridData.CellFormatter = new Formatter < Ticket > ();
    gridData.hasEdit = true;
    gridData.hasDelete = true;
    gridData.hasChildGrid = false;
    gridData.onEdit = this.onTicketEdit.bind(scope);
    gridData.onDelete = this.onTicketDelete.bind(scope);
    gridData.onODataChange = this.ticketODataChange.bind(scope);
    this.TicketHeaders.forEach(m => {
      gridData.CellFormatter[m.header] = this.formatTicketCell.bind(scope);
    });
    gridData.Body = [];
    gridData.Data = [];
    return gridData;
  }

  formatTicketCell(prop: string, data: Ticket): string {
    prop = `${prop.substring(0, 1).toLowerCase()}${prop.substring(1)}`;
    if (data[prop]) {
      switch (prop) {
        case 'createdOn':
          return CommonUtility._formatDate(new Date(data[prop]), 'MM/dd/yyyy');
        case 'status':
          const status = data[prop].toString();
          if (this.statusList) {
            const index = this.statusList.findIndex(f => f.value === status);
            return index !== -1 ? this.statusList[index].display : status;
          }
          return status;
        default:
          return data[prop].toString();
      }
    }
    return '';
  }

  ticketODataChange(oData: ODataGrid, row: Customers): Promise<GridDataView<Ticket>> {
    const scope = this;
    return new Promise < GridDataView < Ticket >> ((resolve, reject) => {
      const ticketGridData = scope.setUpTicketGrid(oData);
      scope.customersService.getCustomerTickets(row.customerId, oData).subscribe(res => {
        if (res && res.success) {
          scope.transformToGridData < Ticket > (res.data, ticketGridData, ticketGridData.oData.Page,
            ticketGridData.oData.PageSize, res.totalCount);
          resolve(ticketGridData);
        } else {
          resolve(ticketGridData);
        }
      });
    });
  }

  onTicketEdit(event: Ticket, parentRowIndex: number) {
    this.ticket = event;
    this.ticketCustomerIndex = parentRowIndex;
    this.manageTicketVisible = true;
  }

  onTicketDelete(event: Ticket, parentRowIndex: number) {
    this.confirmationService
    .showConfirmationMsg(
      'Do want to delete ticket',
      'Delete Ticket',
      event.subject,
      'Delete'
    )
    .subscribe((confirm: IResolveEmit) => {
      if (confirm.resolved) {
        this.ticketCustomerIndex = parentRowIndex;
        const subs = this.customersService
          .deleteTicket(
            event.ticketId
          )
          .subscribe((res: BaseResponse<any>) => {
            this.setTicketDeleteMessage({ success: res.success });
          });
        this.subscriber.add(subs);
      }
    });
  }

  transformToGridData < T extends BaseGridDataView >
  (data: Array < T > , gridData: GridDataView < T >, page: number, pageSize: number, total: number ): GridDataView < T > {
    if (!CommonUtility._isObjEmpty(data)) {
      gridData.Data = [];
      gridData.Body = [];
      data.forEach(f => {
        const r = gridData.Headers.map(h => gridData.CellFormatter[h.header](h.header, f));
        gridData.Data.push(f);
        gridData.Body.push(r);
      });
    } else {
      gridData.Body = [];
    }
    gridData.Page = page;
    gridData.PageSize = pageSize;
    gridData.Total = total;
    gridData = { ...gridData };
    return gridData;
  }
  /** Grid Section ends here */

  addCustomer() {
    this.customer = undefined;
    this.manageCustomerVisible = true;
  }

  manageCustomerFormClosed(isTicketCustomer: boolean) {
    this.manageCustomerVisible = false;
    this.customer = undefined;
    if (isTicketCustomer) {
      this.reloadTicketCustomer();
    }

  }

  manageTicketFormClosed() {
    this.manageTicketVisible = false;
    this.ticket = undefined;
  }

  /**
   * Message Section
   */
  setCustomerSaveMessage(event: any) {
    let msg = '';
    let toasterType = GlobalToasterType.info;
    if (event.success) {
      if (event.isEdit) {
        msg = 'Customer updated successfully.';
      } else {
        msg = 'Customer added successfully.';
      }
      this.loadCustomersGrid();
    } else {
      msg = `Something went with customer ${event.isEdit ? 'update' : 'add'}, please contact administrator.`;
      toasterType = GlobalToasterType.danger;
    }
    this.toasterService.displayToastMessage(msg, toasterType);
  }

  setTicketSaveMessage(event: any) {
    let msg = '';
    let toasterType = GlobalToasterType.info;
    if (event.success) {
      if (event.isEdit) {
        msg = 'Ticket updated successfully.';
      } else {
        msg = 'Ticket added successfully.';
      }
      this.reloadTicketCustomer();
    } else {
      msg = `Something went with ticket ${event.isEdit ? 'update' : 'add'}, please contact administrator.`;
      toasterType = GlobalToasterType.danger;
    }
    this.toasterService.displayToastMessage(msg, toasterType);
  }

  setCustomerDeleteMessage(event: any) {
    let msg = '';
    let toasterType = GlobalToasterType.info;
    if (event.success) {
      msg = 'Customer deleted successfully.';
      this.loadCustomersGrid();
    } else {
      msg = 'Something went with customer delete, please contact administrator.';
      toasterType = GlobalToasterType.danger;
    }
    this.toasterService.displayToastMessage(msg, toasterType);
  }

  setTicketDeleteMessage(event: any) {
    let msg = '';
    let toasterType = GlobalToasterType.info;
    if (event.success) {
      msg = 'Ticket deleted successfully.';
      this.reloadTicketCustomer();
    } else {
      msg = 'Something went with ticket delete, please contact administrator.';
      toasterType = GlobalToasterType.danger;
    }
    this.toasterService.displayToastMessage(msg, toasterType);
  }
  /** Message Section ends here */

  ngOnDestroy() {
    if (this.subscriber && this.subscriber.unsubscribe) {
      this.subscriber.unsubscribe();
    }
  }

}
