import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home-component/home.component';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'primeng/carousel';
import {ButtonModule} from 'primeng/button';
import {GalleriaModule} from 'primeng/galleria';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {BlockUIModule} from 'primeng/blockui';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { ProductsModule } from '../products-page/products.module';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    CarouselModule,
    ButtonModule,
    GalleriaModule,
    TranslateModule,
    BlockUIModule,
    ProgressSpinnerModule,
    ProductsModule,
    DialogModule
  ]
})
export class HomeModule { }
