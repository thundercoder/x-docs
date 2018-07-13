import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { DxFormModule, DxTextAreaModule, DxCheckBoxModule, DxSelectBoxModule, DxButtonModule, DxTemplateModule, DxFileUploaderModule, DxNumberBoxModule } from 'devextreme-angular';
import { CreatePatientComponent } from './create-patient.component';

const routes: Routes = [{
  path: '',
  component: CreatePatientComponent
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
    DxNumberBoxModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ CreatePatientComponent ]
})
export class CreatePatientModule {
}
