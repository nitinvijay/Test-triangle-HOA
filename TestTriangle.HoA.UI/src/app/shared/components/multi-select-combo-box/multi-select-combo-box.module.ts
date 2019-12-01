import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MultiSelectComboBoxComponent } from './multi-select-combo-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupByModule } from '../../pipe/group-by/group-by.module';
import { OutsideClickModule } from '../../directives/outside-click/outside-click.module';

/**
 * Multi select combobox module
 */
@NgModule({
  imports: [OutsideClickModule, CommonModule, FormsModule, ReactiveFormsModule, GroupByModule],
  declarations: [MultiSelectComboBoxComponent],
  exports: [MultiSelectComboBoxComponent]
})
export class MultiSelectComboBoxModule {}
