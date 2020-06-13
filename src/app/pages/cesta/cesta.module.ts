import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BlockUIModule} from 'primeng/blockui';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { CestaComponent } from './cesta/cesta.component';
import { CestaPaso2Component } from './cesta-paso2/cesta-paso2.component';
import { CestaPaso3Component } from './cesta-paso3/cesta-paso3.component';
import { ProductsModule } from '../products-page/products.module';
import { CestaRoutingModule } from './cesta-routing.module';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CestaComponent, CestaPaso2Component, CestaPaso3Component],
  imports: [
    CommonModule,
    FormsModule,
    CestaRoutingModule,
    ProductsModule,
    BlockUIModule,
    ProgressSpinnerModule,
    TableModule,
    ButtonModule,
    TranslateModule
  ]
})
export class CestaModule { }
