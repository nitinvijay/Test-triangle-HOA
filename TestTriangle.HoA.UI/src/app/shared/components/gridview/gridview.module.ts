import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { GridviewComponent } from './gridview.component';
import { OverlayModule } from '../../directives/overlay/overlay.module';


@NgModule({
  imports: [
    NgCommonModule,  OverlayModule
  ],
  declarations: [GridviewComponent],
  exports: [GridviewComponent],
  entryComponents: [GridviewComponent]
})
export class GridviewModule { }
