import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { CanDeactivateGuard } from './core/guards/can-deactivate-guard';
import { AdalGuard } from 'adal-angular4';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AdalGuard] },
  {
    path: 'Customers',
    loadChildren:
      () => import('src/app/customers/customers.module').then(m => m.CustomersModule),
    runGuardsAndResolvers: 'always',
    canDeactivate: [CanDeactivateGuard],
    data: {
      breadcrumb: 'Customers'
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
