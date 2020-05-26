import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PanelComponent } from './main-panel/panel.component';
import { DataComponent } from './data/data.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Mi cuenta',
      breadcrumbEng: 'My account'
    },
    component: PanelComponent,
    children: [
      {
        path: '',
        redirectTo: 'data',
        pathMatch: 'full'
      },{
        path: 'data',
        data: {
          breadcrumb: 'Datos personales',
          breadcrumbEng: 'Personal data'
        },
        component: DataComponent
      },{
        path: 'orders',
        data: {
          breadcrumb: 'Pedidos',
          breadcrumbEng: 'Orders'
        },
        component: OrdersComponent
      }
    ]
  }
  
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRountingModule { }
