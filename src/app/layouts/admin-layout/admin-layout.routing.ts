import { Routes } from '@angular/router';
import { AuthGuard } from 'app/core/auth.guard';

import { DashboardComponent } from '../../dashboard/dashboard.component';


import { ItemListPageComponent } from 'app/items/item-list-page/item-list-page.component';
import { ItemAddPageComponent } from 'app/items/item-add-page/item-add-page.component';
import { ItemViewPageComponent } from 'app/items/item-view-page/item-view-page.component';
``

export const AdminLayoutRoutes: Routes = [

    // { path: 'dashboard',            component: DashboardComponent,                  canActivate: [AuthGuard] },

    

    {path: 'menu',   component: ItemListPageComponent,   canActivate: [AuthGuard]},
    {path: 'menu/add', component: ItemAddPageComponent, canActivate: [AuthGuard]},
    {path: 'menu/:id', component: ItemViewPageComponent,  canActivate: [AuthGuard]}

    
];
