import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsState } from 'src/app/settings/settings.model';
import { Router } from '@angular/router';
import { ProductsService } from '../../products-page/service/products.service';
import { Store, select } from '@ngrx/store';
import { actionSettingsBuscador } from 'src/app/settings/settings.actions';
import { selectSettingsBuscador } from 'src/app/settings/settings.selectors';
import { Subscription, Observable } from 'rxjs';
import { Producto } from 'src/app/models/producto';
import { Cesta, ProductoCesta } from 'src/app/models/cesta';


@Component({
  selector: 'app-cesta',
  templateUrl: './cesta.component.html',
  styleUrls: ['./cesta.component.scss']
})
export class CestaComponent implements OnInit, OnDestroy {

  language: string = "es";
  textoBuscador: string = null;
  contenedorBusquedaProducto: boolean = false;
  textoBuscadorOvservable$: Observable<string>;
  private subscription: Subscription[] = [];
  blockedDocument: boolean = true;
  productLoaded: Promise<boolean>;

  cesta: Cesta;
  productsCesta: ProductoCesta[];
  cantidades: number[] = [1,2,3,4,5,6,7,8,9,10];
  cantidadProducto: number = 1;
  isAuthenticatedBoolean: boolean = false;

  constructor(private router:Router,
    private productsService: ProductsService,
    private store: Store<{settings: SettingsState}>,
    public translate: TranslateService) { }

  ngOnInit(): void {
    this.getLanguageBrowser();
    this.manageBuscadorSuperior();
    this.getProductsCart();
    this.unblockScreen();
    this.isAuthenticated();
    this.triggerBotonCesta();
  }

  getLanguageBrowser(){
    this.language = this.productsService.getLanguageBrowser();
    }

  manageBuscadorSuperior(){
    /*para el buscador*/
    this.store.dispatch(actionSettingsBuscador({
      buscador: null
    })) 
    this.textoBuscadorOvservable$ = this.store.pipe(select(selectSettingsBuscador));
    this.subscription.push(this.textoBuscadorOvservable$.subscribe( (texto) => {
        this.textoBuscador = texto;
        if(this.textoBuscador != null && this.textoBuscador != ''){
          this.contenedorBusquedaProducto = true;
        }else{
          this.contenedorBusquedaProducto = false;
        }
    }))
  }

  getProductsCart(){
    this.productsCesta = [];
    this.cesta = this.productsService.getProductosCesta();
    this.productsCesta = this.cesta.productosCesta;
  }

  eliminarProducto(index: number){
    this.cesta = this.productsService.removeProductoCesta(index);
    this.productsCesta = this.cesta.productosCesta;
  }

  isAuthenticated(){
    if(window.sessionStorage.getItem('authenticated') == 'true'){
      this.isAuthenticatedBoolean = true;
    }
  }
  paso2(){
    if(!this.isAuthenticatedBoolean){
      this.triggerBotonIniciarSesion();
    }else{
      this.router.navigate(['cart','paso2']);
    }
  }

  triggerBotonCesta(){
    let botonCesta: HTMLElement = document.getElementById('botonShoppingCart') as HTMLElement;
    let contenedorCestaNormal: HTMLElement = document.getElementById('divRegistro') as HTMLElement;
    if(this.isElementVisible(contenedorCestaNormal)){
      let contenedorCesta: HTMLElement = document.getElementById('overlayShoppingCart') as HTMLElement;
      if(contenedorCesta == null){
      }else{
        setTimeout(() => {
          botonCesta.click();
        }, 1000);
      }
    }
   
    let botonCestaMobile: HTMLElement = document.getElementById('botonShoppingCartMobile') as HTMLElement;
    let contenedorCestaMobile: HTMLElement = document.getElementById('cestaIconMobile') as HTMLElement;
    if(this.isElementVisible(contenedorCestaMobile)){
      let contenedorCestaMobile: HTMLElement = document.getElementById('overlayShoppingCartMobile') as HTMLElement;
      if(contenedorCestaMobile == null){
      }else{
        setTimeout(() => {
          botonCestaMobile.click();
        }, 1000);
      }
    }
  }

  triggerBotonIniciarSesion(){
    let botonLogin: HTMLElement = document.getElementById('botonLogin') as HTMLElement;
    let contenedorLoginNormal: HTMLElement = document.getElementById('divLoginNormal') as HTMLElement;
    if(contenedorLoginNormal != null && this.isElementVisible(contenedorLoginNormal)){
      setTimeout(() => {
        botonLogin.click();
      }, 1000);
    }
   
    let botonLoginMobile: HTMLElement = document.getElementById('botonLoginMobile') as HTMLElement;
    let contenedorLoginMobile: HTMLElement = document.getElementById('divLoginMobile') as HTMLElement;
    if(contenedorLoginMobile != null && this.isElementVisible(contenedorLoginMobile)){
      setTimeout(() => {
        botonLoginMobile.click();
      }, 1000);
    }
  }

  isElementVisible(element) { 
    if (element.offsetWidth ||  
       element.offsetHeight ||  
       element.getClientRects().length) 
        return true; 
    else 
        return false; 
  }

  unblockScreen(){
    this.blockedDocument = true;
    setTimeout(() => {
      this.blockedDocument = false;
      this.productLoaded = Promise.resolve(true); 
    }, 1000);
  }
  changeProductAmount(){
    this.cesta = this.productsService.actualizarCesta(this.productsCesta);
  }

  ngOnDestroy(){
    this.subscription.forEach(s => s.unsubscribe());
  }

}
