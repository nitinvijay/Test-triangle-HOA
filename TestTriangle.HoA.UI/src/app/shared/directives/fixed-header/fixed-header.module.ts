import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FixedHeaderDirective } from './fixed-header.directive';

/**
 * Fiexd header module
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FixedHeaderDirective],
  exports: [FixedHeaderDirective]
})
export class FixedHeaderModule { }
