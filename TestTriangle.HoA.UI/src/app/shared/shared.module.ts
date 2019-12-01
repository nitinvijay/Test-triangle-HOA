import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelsModule } from './models/models.module';
import { FixedHeaderModule } from './directives/fixed-header/fixed-header.module';
import { OutsideClickModule } from './directives/outside-click/outside-click.module';
import { OverlayModule } from './directives/overlay/overlay.module';
import { GroupByModule } from './pipe/group-by/group-by.module';
import { MultiSelectComboBoxModule } from './components/multi-select-combo-box/multi-select-combo-box.module';
import { GridviewModule } from './components/gridview/gridview.module';
import { TooltipModule } from './directives/tooltip/tooltip.module';
import { DisableAutoCompleteModule } from './directives/auto-complete/auto-complete.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ModelsModule,
    MultiSelectComboBoxModule,
    FixedHeaderModule,
    OutsideClickModule,
    OverlayModule,
    GroupByModule,
    GridviewModule,
    TooltipModule,
    DisableAutoCompleteModule
  ],
  exports: [
    ModelsModule,
    MultiSelectComboBoxModule,
    FixedHeaderModule,
    OutsideClickModule,
    OverlayModule,
    GroupByModule,
    GridviewModule,
    TooltipModule,
    DisableAutoCompleteModule
  ]
})
export class SharedModule { }
