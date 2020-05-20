import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from './main-panel/panel.component';
import { DataComponent } from './data/data.component';
import { OrdersComponent } from './orders/orders.component';
import { AccountRountingModule } from './account-rounting.module';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {KeyFilterModule} from 'primeng/keyfilter';
import {DropdownModule} from 'primeng/dropdown';
import {MessageModule} from 'primeng/message';
import {InputMaskModule} from 'primeng/inputmask';
import {FileUploadModule} from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { ShoopingCartComponent } from './shopping-cart/shooping-cart.component';
import { I18nModule } from 'src/app/translate/i18n/i18n.module';
import { TranslateModule } from '@ngx-translate/core';




@NgModule({
  declarations: [PanelComponent, DataComponent, OrdersComponent, ShoopingCartComponent],
  imports: [
    CommonModule,
    AccountRountingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    TabMenuModule,
    TabViewModule,
    KeyFilterModule,
    DropdownModule,
    MessageModule,
    InputMaskModule,
    FileUploadModule,
    TableModule,
    TranslateModule
    ],
    exports: [
      ShoopingCartComponent
    ]
})
export class AccountModule { }
