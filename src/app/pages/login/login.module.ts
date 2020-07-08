import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login-component/login.component';
import { LoginRoutingModule } from './login-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ToastModule} from 'primeng/toast';
import {MessageModule} from 'primeng/message';
import {PanelModule} from 'primeng/panel';
import {DropdownModule} from 'primeng/dropdown';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule, 
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    MessageModule,
    PanelModule,
    DropdownModule,
    ScrollingModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    TranslateModule
  ]
})
export class LoginModule { }
