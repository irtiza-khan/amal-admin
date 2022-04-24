import { Component, OnInit } from '@angular/core';
import { AuthGuard } from 'app/core/auth.guard';
import { AuthService } from 'app/core/auth.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [   
    { path: '/menu',          title: 'Menu Items',  icon: 'library_books', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  user: any;


  constructor(public auth: AuthService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.user = this.auth.user;
    console.log('Users Data ');
    this.user.subscribe(user =>{
      console.log(user)
    })
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  logout() {

    this.auth.signOut();
    // this.router.navigate(['/']);
  }
}
