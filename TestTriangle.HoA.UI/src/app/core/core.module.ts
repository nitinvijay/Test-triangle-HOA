import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanDeactivateGuard } from './guards/can-deactivate-guard';
import { HttpCacheService } from './services/cache.service';
import { FooterComponent } from './components/footer/footer.component';
import { GlobalConfirmationModule } from './components/global-confirmation/global-confirmation.module';
import { GlobalToasterModule } from './components/global-toaster/global-toaster.module';
import { HeaderComponent } from './components/header/header.component';
import { NavigationComponent } from './components/header/navigation/navigation.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [    
    FooterComponent,
    HeaderComponent,
    NavigationComponent,
    BreadcrumbsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    GlobalConfirmationModule,
    GlobalToasterModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    BreadcrumbsComponent
  ],
  providers: [
    CanDeactivateGuard,
    HttpCacheService
  ]
})
export class CoreModule { }
