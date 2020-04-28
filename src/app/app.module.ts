import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { StoreModule } from '@ngrx/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginModule } from './pages/login/login.module';
import { RegisterComponent } from './pages/register/register-component/register.component';
import { HomeComponent } from './pages/home/home-component/home.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {ToolbarModule} from 'primeng/toolbar';
import {SplitButtonModule} from 'primeng/splitbutton';
import {MegaMenuModule} from 'primeng/megamenu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import { ProductsModule } from './pages/products-page/products.module';
import {ButtonModule} from 'primeng/button';
import { HttpClientModule } from '@angular/common/http'; 
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { AccountModule } from './pages/account/account.module';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import { HomeModule } from './pages/home/home.module';



@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoginModule,
    DynamicDialogModule,
    AutoCompleteModule,
    BrowserAnimationsModule,
    ToolbarModule,
    SplitButtonModule,
    MegaMenuModule,
    BreadcrumbModule,
    ButtonModule,
    OverlayPanelModule,
    FontAwesomeModule,
    ProductsModule,
    HomeModule,
    HttpClientModule,
    AccountModule,
    ScrollPanelModule,
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    StoreModule.forRoot({}, {})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
