import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { DxFormModule, DxTextAreaModule, DxCheckBoxModule, DxSelectBoxModule, DxButtonModule, DxTemplateModule, DxFileUploaderModule, DxNumberBoxModule } from 'devextreme-angular';
import { EditPatientComponent } from './edit-patient.component';

const routes: Routes = [{
  path: '',
  component: EditPatientComponent
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
  declarations: [ EditPatientComponent ]
})
export class EditPatientModule {
}
