import { Routes } from '@angular/router';
import { AuthGuard } from 'app/core/auth.guard';

import { DashboardComponent } from '../../dashboard/dashboard.component';


import { ItemListPageComponent } from 'app/items/item-list-page/item-list-page.component';
import { ItemAddPageComponent } from 'app/items/item-add-page/item-add-page.component';
import { ItemViewPageComponent } from 'app/items/item-view-page/item-view-page.component';
import { OrderPreparingListComponent } from 'app/order/order-preparing-list/order-preparing-list.component';
import { OrderPreparedListComponent } from 'app/order/order-prepared-list/order-prepared-list.component';
import { OrderDeliveredListComponent } from 'app/order/order-delivered-list/order-delivered-list.component';
import { OrderDelieveringListComponent } from 'app/order/order-delievering-list/order-delievering-list.component';
``

export const AdminLayoutRoutes: Routes = [

    // { path: 'dashboard',            component: DashboardComponent,                  canActivate: [AuthGuard] },

    

    {path: 'menu',   component: ItemListPageComponent,   canActivate: [AuthGuard]},
    {path: 'menu/add', component: ItemAddPageComponent, canActivate: [AuthGuard]},
    {path: 'menu/:id', component: ItemViewPageComponent,  canActivate: [AuthGuard]},

    {path: 'order/preparing', component: OrderPreparingListComponent, canActivate:[AuthGuard]},
    {path: 'order/prepared', component: OrderPreparedListComponent,  canActivate:[AuthGuard]},
    {path: 'order/delivered', component: OrderDeliveredListComponent, canActivate:[AuthGuard]},
    {path: 'order/delievering', component: OrderDelieveringListComponent, canActivate:[AuthGuard]}

    
];
