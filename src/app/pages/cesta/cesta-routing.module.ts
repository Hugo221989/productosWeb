import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CestaComponent } from './cesta/cesta.component';
import { CestaPaso2Component } from './cesta-paso2/cesta-paso2.component';
import { CestaPaso3Component } from './cesta-paso3/cesta-paso3.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Paso 1',
      breadcrumbEng: 'Step 1'
    },
    component: CestaComponent
  },{
    path: 'detail/:id',
    data: {
      breadcrumb: localStorage.getItem('nombreBreadcrumb'),
      breadcrumbEng: localStorage.getItem('nombreBreadcrumbEng')
    },
    component: CestaPaso2Component
  },{
    path: 'detail/:id',
    data: {
      breadcrumb: localStorage.getItem('nombreBreadcrumb'),
      breadcrumbEng: localStorage.getItem('nombreBreadcrumbEng')
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
