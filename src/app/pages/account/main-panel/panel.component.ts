import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { TranslateService } from '@ngx-translate/core';
import { ProductsService } from '../../products-page/service/products.service';
import { selectSettingsBuscador } from 'src/app/settings/settings.selectors';
import { SettingsState } from 'src/app/settings/settings.model';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { myAnimation } from 'src/app/animations/animation';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  animations: [myAnimation]
})
export class PanelComponent implements OnInit, OnDestroy {
  language: string = "es";
  selectedLanguage: string = 'es';

  tabMenuItem: MenuItem[] = [];
  activeItem: MenuItem;

  textoBuscadorOvservable$: Observable<string>;
  textoBuscador: string = null;
  private subscription: Subscription[] = [];
  contenedorBusquedaProducto: boolean = false;

  blockedDocument: boolean = true;
  productLoaded: Promise<boolean>;

  url: string;
  
  constructor(private productsService: ProductsService,
    public translate: TranslateService,
    private store: Store<{settings: SettingsState}>) { }

  ngOnInit(): void {
    this.getLanguageBrowser();
    this.manageBuscadorSuperior();
    this.unblockScreen();
  }

  getLanguageBrowser(){
    this.language = this.productsService.getLanguageBrowser();
    if(this.language == 'es'){
      this.selectedLanguage = 'es';
    }else{
      this.selectedLanguage = 'en';
    }

    this.language = this.productsService.getLanguageBrowser();  
    this.subscription.push(this.translate.getTranslation(this.selectedLanguage).subscribe(data=>{
      this.datosCuenta = data['datos.cuenta'];
      this.pedidos = data.pedidos;
      this.setTabMenuItems();
    }));
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
    this.tabMenuItem = [
      {label: this.datosCuenta, icon: 'pi pi-user-edit', routerLink:'data'},
      {label: this.pedidos, icon: 'pi pi-sign-out', routerLink:'orders'}
    ];
    this.getUrlParams();
    if(this.datosCuenta == null){
      this.setTabMenuItems();
    }
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

  unblockScreen(){
    this.blockedDocument = true;
    setTimeout(() => {
      this.blockedDocument = false;
      this.productLoaded = Promise.resolve(true); 
    }, 1000);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  ngOnDestroy(){
    this.subscription.forEach(s => s.unsubscribe());
  }
}
