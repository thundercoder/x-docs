import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {
  DxFormModule,
  DxTextAreaModule,
  DxCheckBoxModule,
  DxSelectBoxModule,
  DxButtonModule,
  DxTemplateModule,
  DxFileUploaderModule,
  DxListModule,
  DxMultiViewModule,
  DxDateBoxModule,
  DxNumberBoxModule,
  DxDataGridModule
} from 'devextreme-angular';
import { ListPatientsComponent } from './list-patients.component';

const routes: Routes = [{
  path: '',
  component: ListPatientsComponent
}];

@NgModule({
  imports: [
    CommonModule,
    DxFormModule,
    DxListModule,
    DxTextAreaModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxButtonModule,
    FormsModule,
    DxTemplateModule,
    DxFileUploaderModule,
    DxMultiViewModule,
    DxDateBoxModule,
    DxNumberBoxModule,
    DxTextAreaModule,
    DxDataGridModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ ListPatientsComponent ]
})
export class ListPatientsModule {
}
