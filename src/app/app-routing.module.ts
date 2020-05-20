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
    path: 'products/:cat/:subcat',
    data:  {
      breadcrumb: 'Nutrición'
    },
    loadChildren: () =>
      import('./pages/products-page/products.module').then(m => m.ProductsModule)
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./pages/account/account.module').then(m => m.AccountModule),
      canActivate: [AuthGuardService]
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
