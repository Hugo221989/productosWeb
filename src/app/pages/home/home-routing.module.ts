import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home-component/home.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Inicio',
      animation: 'home'
    },
    component: HomeComponent
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class HomeRoutingModule { }
