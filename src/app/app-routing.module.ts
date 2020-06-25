import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './auth/auth-guard.service';
import { TranslateModule } from '@ngx-translate/core';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'products/:catPadre/:cat/:subcat',
    data:  {
      breadcrumb: 'Nutrición',
      breadcrumbEng: 'Nutrition',
      modulo: 'products',
      animation: 'HomePage'
    },
    loadChildren: () =>
      import('./pages/products-page/products.module').then(m => m.ProductsModule)
  },
  {
    path: 'feeding/:catPadre/:cat/:subcat',
    data:  {
      breadcrumb: 'Alimentacion',
      breadcrumbEng: 'Feeding',
      modulo: 'feeding',
      animation: 'HomePage'
    },
    loadChildren: () =>
      import('./pages/products-page/products.module').then(m => m.ProductsModule)
  },
  {
    path: 'home',
    data: {
      animation: 'HomePage'
    },
    loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'account',
    data: {
      animation: 'HomePage'
    },
    loadChildren: () =>
      import('./pages/account/account.module').then(m => m.AccountModule),
      canActivate: [AuthGuardService]
  },
  {
    path: 'cart',
    data: {
      animation: 'HomePage'
    },
    loadChildren: () =>
      import('./pages/cesta/cesta.module').then(m => m.CestaModule)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, TranslateModule]
})
export class AppRoutingModule { }
