import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsPageComponent } from './products-page/products-page.component';
import { ProductsRoutingModule } from './products-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {DataViewModule} from 'primeng/dataview';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {PanelModule} from 'primeng/panel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RatingModule} from 'primeng/rating';
import {CheckboxModule} from 'primeng/checkbox';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import {GalleriaModule} from 'primeng/galleria';
import {ButtonModule} from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import {CarouselModule} from 'primeng/carousel';
import {SpinnerModule} from 'primeng/spinner';
import {BlockUIModule} from 'primeng/blockui';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {TreeModule} from 'primeng/tree';
import {SliderModule} from 'primeng/slider';
import { I18nModule } from 'src/app/translate/i18n/i18n.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [ProductsPageComponent, ProductDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsRoutingModule,
    DataViewModule,
    DialogModule,
    DropdownModule,
    PanelModule,
    RatingModule,
    CheckboxModule,
    GalleriaModule,
    ButtonModule,
    TabViewModule,
    CarouselModule,
    FontAwesomeModule,
    SpinnerModule,
    BlockUIModule,
    ProgressSpinnerModule,
    TreeModule,
    SliderModule,
    I18nModule,
    TranslateModule
  ],
  exports: [
    I18nModule,
    ProductsPageComponent
  ]
})
export class ProductsModule { }
