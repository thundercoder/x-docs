import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { TablesComponent } from './tables/tables.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path: 'dashboard', component: HomeComponent},
  {path: 'profile', loadChildren: 'app/pages/profile/profile.module#ProfileModule'},
  {path: 'table', component: TablesComponent},
  {path: 'typography', component: TypographyComponent},
  {path: 'icons', component: IconsComponent},
  {path: 'maps', component: MapsComponent},
  {path: 'notifications', component: NotificationsComponent},
  {path: 'upgrade', component: UpgradeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'events/create', loadChildren: 'app/pages/events/create-event/create-event.module#CreateEventModule'},
  {path: 'events/:id/detail', loadChildren: 'app/pages/events/edit-event/edit-event.module#EditEventModule'},
  {path: 'events', loadChildren: 'app/pages/events/list-events/list-events.module#ListEventsModule'},
  {path: 'patients/create', loadChildren: 'app/pages/patients/create-patient/create-patient.module#CreatePatientModule'},
  {path: 'patients/:id/detail', loadChildren: 'app/pages/patients/edit-patient/edit-patient.module#EditPatientModule'},
  {path: 'patients', loadChildren: 'app/pages/patients/list-patients/list-patients.module#ListPatientsModule'},
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ],
})
export class AppRoutingModule {
}
