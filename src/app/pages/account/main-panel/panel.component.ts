import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { TranslateService } from '@ngx-translate/core';
import { ProductsService } from '../../products-page/service/products.service';
import { selectSettingsBuscador } from 'src/app/settings/settings.selectors';
import { SettingsState } from 'src/app/settings/settings.model';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit, OnDestroy {
  language: string = "es";

  tabMenuItem: MenuItem[] = [];
  activeItem: MenuItem;

  textoBuscadorOvservable$: Observable<string>;
  textoBuscador: string = null;
  private subscription: Subscription[] = [];
  contenedorBusquedaProducto: boolean = false;

  url: string;
  
  constructor(private productsService: ProductsService,
    public translate: TranslateService,
    private store: Store<{settings: SettingsState}>) { }

  ngOnInit(): void {
    this.getLanguageBrowser();
    this.manageBuscadorSuperior();
  }

  getLanguageBrowser(){
      this.language = this.productsService.getLanguageBrowser();  
      this.subscription.push(this.translate.stream('datos.cuenta').subscribe(data => {this.datosCuenta = data}));
      this.subscription.push(this.translate.stream('pedidos').subscribe(data => {this.pedidos = data}));
      setTimeout(() => {
        this.setTabMenuItems();
      }, 500);
  }

  getUrlParams(){
    this.url = window.location.href;
    if(this.tabMenuItem.length > 0){
      if(this.url.indexOf('orders') != -1){
        this.activeItem = this.tabMenuItem[1];
      }else{
        this.activeItem = this.tabMenuItem[0];
      }
    }
  }


  setTabMenuItems(){
    setTimeout(() => {
      this.tabMenuItem = [
        {label: this.datosCuenta, icon: 'pi pi-user-edit', routerLink:'data'},
        {label: this.pedidos, icon: 'pi pi-sign-out', routerLink:'orders'}
      ];
      this.getUrlParams();
      if(this.datosCuenta == null){
        this.setTabMenuItems();
      }
    }, 500);
  }
  datosCuenta: string;
  pedidos: string;

  manageBuscadorSuperior(){
    /*para el buscador*/
    this.textoBuscadorOvservable$ = this.store.pipe(select(selectSettingsBuscador));
    this.subscription.push(this.textoBuscadorOvservable$.subscribe( (texto) => {
        this.textoBuscador = texto;
        if(this.textoBuscador != null && this.textoBuscador != ''){
          this.contenedorBusquedaProducto = true;
        }else{
          this.contenedorBusquedaProducto = false;
          this.getUrlParams();
        }
    }))
  }

  ngOnDestroy(){
    this.subscription.forEach(s => s.unsubscribe());
  }
}
