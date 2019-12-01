import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers.component';
import { ManageCustomerComponent } from './manage-customer/manage-customer.component';
import { CustomersRoutingModule } from './customers-routing.module';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ManageTicketComponent } from './manage-ticket/manage-ticket.component';

@NgModule({
  declarations: [CustomersComponent, ManageCustomerComponent, ManageTicketComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule
  ],
  exports: [
    CustomersRoutingModule
  ]
})
export class CustomersModule { }
