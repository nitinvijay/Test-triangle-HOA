import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalToasterComponent } from './global-toaster.component';
import { RouterModule } from '@angular/router';
import { GlobalConfirmationModule } from '../global-confirmation/global-confirmation.module';

/**
 * Global Toaster module
 */
@NgModule({
  imports: [CommonModule,
    RouterModule, GlobalConfirmationModule],
  declarations: [GlobalToasterComponent],
  exports: [GlobalToasterComponent],
  providers: []
})

export class GlobalToasterModule { }
