import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';

import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule, MatNativeDateModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';

import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ItemAddPageComponent } from 'app/items/item-add-page/item-add-page.component';
import { ItemViewPageComponent } from 'app/items/item-view-page/item-view-page.component';
import { ItemListPageComponent } from 'app/items/item-list-page/item-list-page.component';
import { NavbarComponent } from 'app/shared/navbar/navbar.component';
import { ImagecardComponent } from 'app/shared/imagecard/imagecard.component';
import { OrdercardComponent } from 'app/shared/ordercard/ordercard.component';
import { OrderDelieveringListComponent } from 'app/order/order-delievering-list/order-delievering-list.component';
import { OrderPreparedListComponent } from 'app/order/order-prepared-list/order-prepared-list.component';
import { OrderDeliveredListComponent } from 'app/order/order-delivered-list/order-delivered-list.component';
import { OrderPreparingListComponent } from 'app/order/order-preparing-list/order-preparing-list.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatIconModule,
    
  ],
  declarations: [
    DashboardComponent,
    ItemAddPageComponent,
    ItemViewPageComponent,
    ItemListPageComponent,
    NavbarComponent,
    ImagecardComponent,
    OrdercardComponent,
    OrderDelieveringListComponent,
    OrderDeliveredListComponent,
    OrderPreparedListComponent,
    OrderPreparingListComponent

  ]
})

export class AdminLayoutModule {}
