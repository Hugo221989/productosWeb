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
import { Cesta } from 'src/app/models/cesta';

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
  products: Producto[];
  cantidades: number[] = [1,2,3,4,5,6,7,8,9,10];
  cantidadProducto: number = 1;

  constructor(private router:Router,
    private productsService: ProductsService,
    private store: Store<{settings: SettingsState}>,
    public translate: TranslateService) { }

  ngOnInit(): void {
    this.getLanguageBrowser();
    this.manageBuscadorSuperior();
    this.getProductsCart();
    this.unblockScreen();
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
    this.products = [];
    this.cesta = this.productsService.getProductosCesta();
    this.products = this.cesta.productos;
  }

  eliminarProducto(index: number){
    this.cesta = this.productsService.removeProductoCesta(index);
    this.products = this.cesta.productos;
  }

  paso2(){
    this.router.navigate['paso2'];
  }

  unblockScreen(){
    this.blockedDocument = true;
    setTimeout(() => {
      this.blockedDocument = false;
      this.productLoaded = Promise.resolve(true); 
    }, 1000);
  }
  changeProductAmount(){
    this.cesta = this.productsService.actualizarCesta(this.products);
  }

  ngOnDestroy(){
    this.subscription.forEach(s => s.unsubscribe());
  }

}
