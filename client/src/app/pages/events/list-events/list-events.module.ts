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
import { ListEventsComponent } from './list-events.component';

const routes: Routes = [{
  path: '',
  component: ListEventsComponent
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
  declarations: [ ListEventsComponent ]
})
export class ListEventsModule {
}
