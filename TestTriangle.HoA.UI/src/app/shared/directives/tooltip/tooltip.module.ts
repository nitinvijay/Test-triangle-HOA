import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from './tooltip.directive';
import { TooltipComponent } from './tooltip.component';



/**
 * Tooltip module
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TooltipDirective,
    TooltipComponent,
  ],
  exports: [
    TooltipDirective,
    TooltipComponent,
  ],
  entryComponents: [
    TooltipComponent
  ]
})
export class TooltipModule {
 }
