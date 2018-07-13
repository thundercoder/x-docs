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
  DxDateBoxModule,
  DxNumberBoxModule, DxPopupModule
} from 'devextreme-angular';
import { ProfileComponent } from './profile.component';

const routes: Routes = [{
  path: '',
  component: ProfileComponent
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
    DxListModule,
    DxDateBoxModule,
    DxNumberBoxModule,
    DxPopupModule,
    DxTextAreaModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ ProfileComponent ]
})
export class ProfileModule {
}
