import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsPageComponent } from './products-page/products-page.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: null,
      breadcrumbEng: null
    },
    component: ProductsPageComponent
  },{
    path: 'detail/:id',
    data: {
      breadcrumb: localStorage.getItem('nombreBreadcrumb'),
      breadcrumbEng: localStorage.getItem('nombreBreadcrumbEng'),
      animation: 'productDetail'
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
