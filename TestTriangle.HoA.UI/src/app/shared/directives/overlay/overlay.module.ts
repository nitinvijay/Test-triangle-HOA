import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayComponent } from './overlay.component';
import { OverlayDirective } from './overlay.directive';

export * from './overlay.directive';
export * from './overlay.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [OverlayComponent, OverlayDirective],
  exports: [OverlayComponent, OverlayDirective],
  entryComponents: [
    OverlayComponent
  ]
})
export class OverlayModule { }
