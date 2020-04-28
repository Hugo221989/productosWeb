import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsPageComponent } from './products-page/products-page.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Productos'
    },
    component: ProductsPageComponent
  },{
    path: 'detail/:id',
    data: {
      breadcrumb: 'Detalle'
    },
    component: ProductDetailComponent
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
export class ProductsRoutingModule { }
