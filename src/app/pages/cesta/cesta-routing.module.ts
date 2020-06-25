import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CestaComponent } from './cesta/cesta.component';
import { CestaPaso2Component } from './cesta-paso2/cesta-paso2.component';
import { CestaPaso3Component } from './cesta-paso3/cesta-paso3.component';

const routes: Routes = [
  {
    path: 'paso1',
    data: {
      breadcrumb: 'Cesta > Paso 1',
      breadcrumbEng: 'Cart > Step 1',
      animation: 'cesta1'
    },
    component: CestaComponent,
  },{
      path: 'paso2',
      data: {
        breadcrumb: 'Cesta > Paso 2',
        breadcrumbEng: 'Cart > Step 2',
        animation: 'cesta2'
      },
      component: CestaPaso2Component
    },{
      path: 'paso3',
      data: {
        breadcrumb: 'Cesta > Paso 3',
        breadcrumbEng: 'Cart > Step 3',
        animation: 'cesta3'
      },
      component: CestaPaso3Component
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
export class CestaRoutingModule { }
