import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalConfirmationComponent } from './global-confirmation.component';
import { SessionTimeoutComponent } from './session-timeout/session-timeout.component';
import { NotImplementedComponent } from './not-implemented/not-implemented.component';

/**
 * Global confirmation module
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [GlobalConfirmationComponent, SessionTimeoutComponent, NotImplementedComponent],
  exports: [GlobalConfirmationComponent, NotImplementedComponent, SessionTimeoutComponent],
  providers: [],
  entryComponents: [SessionTimeoutComponent, NotImplementedComponent]

})

export class GlobalConfirmationModule { }
