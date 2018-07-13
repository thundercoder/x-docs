import { Component, OnInit } from '@angular/core';

declare const $: any;

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  {path: 'dashboard', title: 'Dashboard', icon: 'pe-7s-graph', class: ''},
  {path: 'profile', title: 'Profile', icon: 'fas fa-user', class: ''},
  {path: 'events', title: 'Events', icon: 'pe-7s-note2', class: ''},
  {path: 'patients', title: 'Patients', icon: 'fas fa-users', class: ''},
  {path: 'icons', title: 'Icons', icon: 'pe-7s-science', class: ''},
  {path: 'maps', title: 'Maps', icon: 'pe-7s-map-marker', class: ''},
  {path: 'notifications', title: 'Notifications', icon: 'pe-7s-bell', class: ''},
  {path: 'events/create', title: 'Upgrade to PRO', icon: 'pe-7s-rocket', class: 'active-pro'},
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() {
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  isMobileMenu() {
    return $(window).width() <= 991;
  };
}
