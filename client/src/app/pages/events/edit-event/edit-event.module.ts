import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { DxFormModule, DxTextAreaModule, DxCheckBoxModule, DxSelectBoxModule, DxButtonModule, DxTemplateModule, DxFileUploaderModule } from 'devextreme-angular';
import { EditEventComponent } from './edit-event.component';

const routes: Routes = [{
  path: '',
  component: EditEventComponent
}];

@NgModule({
  imports: [
    CommonModule,
    DxFormModule,
    DxTextAreaModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxButtonModule,
    FormsModule,
    DxTemplateModule,
    DxFileUploaderModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ EditEventComponent ]
})
export class EditEventModule {
}
