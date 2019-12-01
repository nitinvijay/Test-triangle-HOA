import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers.component';
import { ManageCustomerComponent } from './manage-customer/manage-customer.component';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '../core/guards/can-deactivate-guard';

const routes: Routes = [
  {
    path: '',
    component: CustomersComponent,
    data: {
      breadcrumb: 'Customers'
    }
  },
];

/**
 * Customers Routing Module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class CustomersRoutingModule { }
