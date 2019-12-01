import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutsideClickDirective } from './outside-click.directive';

/**
 * Outside click module
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [OutsideClickDirective],
  exports: [OutsideClickDirective]
})
export class OutsideClickModule { }
