import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, CatProductoDto } from 'src/app/models/producto';
import { Sabor } from 'src/app/models/productoOtrosDatos';
import { Cesta, ProductoCesta } from 'src/app/models/cesta';
import { SettingsState } from 'src/app/settings/settings.model';
import { Store } from '@ngrx/store';
import { actionSettingsCarritoVacio, actionSettingsNombreBreadcrumb, actionSettingsNombreBreadcrumbEng } from 'src/app/settings/settings.actions';
import { TranslateService } from '@ngx-translate/core';
import { TranslateCacheService } from 'ngx-translate-cache';
import { CategoriaPadre } from 'src/app/models/categoria';
import { TokenStorageService } from '../../login/logn-service/token-storage.service';
import { User } from 'src/app/models/user';

const USER_API = 'http://localhost:8182/restfull/usuario/';
const PRODUCT_API = 'http://localhost:8182/restfull/producto/';
const CATEGORIA_API = 'http://localhost:8182/restfull/categoria/';
const PEDIDO_API = 'http://localhost:8182/restfull/pedido/';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  cesta: Cesta;
  productosCesta: ProductoCesta[];
  producto: Producto;
  importeTotal: number;
  importeSubTotal: number;
  envio: number;
  carritoVacio: boolean = true;

  browserLang: string = "es";

  constructor(private httpClient: HttpClient, private store: Store<{settings: SettingsState}>
              , translateCacheService: TranslateCacheService, translate: TranslateService,
              tokenStorageService: TokenStorageService) { 

                this.browserLang = translateCacheService.getCachedLanguage() || translate.getBrowserLang();

              }

  getLanguageBrowser(){
    return this.browserLang;
  }

  getProductsList(buscador: string): Observable<any> {
    return this.httpClient.get<Producto[]>(`${USER_API}obtenerProductos?buscador=${buscador}&language=${this.browserLang}`);
  }

  getProductsListBySubCat(subCategoria: string): Observable<any> {
    if(subCategoria == 'all'){
      subCategoria = null;
    }
    return this.httpClient.get<Producto[]>(`${USER_API}obtenerProductosBySubCategoria?subCategoria=${subCategoria}&language=${this.browserLang}`);
  }

  getProductsListByCat(categoria: string): Observable<any> {
    if(categoria == 'all'){
      categoria = null;
    }
    return this.httpClient.get<Producto[]>(`${USER_API}obtenerProductosByCategoria?categoria=${categoria}&language=${this.browserLang}`);
  }
  getProductsListByCatPadre(categoriaPadre: number): Observable<any> {
    return this.httpClient.get<Producto[]>(`${USER_API}obtenerProductosByCategoriaPadre?categoriaPadre=${categoriaPadre}&language=${this.browserLang}`);
  }


  getProductsNutritionListRelacionados(): Observable<any> {
    return this.httpClient.get<CategoriaPadre>(`${CATEGORIA_API}obtenerCategoriaPadreByKey?idCategoriaPadre=nutricion`);
  }

  getProductsFeedingListRelacionados(): Observable<any> {
    return this.httpClient.get<CategoriaPadre>(`${CATEGORIA_API}obtenerCategoriaPadreByKey?idCategoriaPadre=alimentacion`);
  }

  getProductById(idProducto: number): Observable<any> {
    return this.httpClient.get<Producto>(`${USER_API}obtenerProductoById?idProducto=${idProducto}&language=${this.browserLang}`);
  }

  getCatSubCatProduct(idProducto: number){
    return this.httpClient.get<CatProductoDto>(`${PRODUCT_API}obtenerCatAndSubCatByProductoId?idProducto=${idProducto}&language=${this.browserLang}`);
  }

  getSabores(): Observable<any> {
    return this.httpClient.get<Sabor[]>(`${USER_API}obtenerProductoById?language=${this.browserLang}`);
  }
  
  /* SHOPPING CART */
  addProductToCart(productoCesta: ProductoCesta){
    if(sessionStorage.getItem('cesta')){
      this.cesta =  JSON.parse(sessionStorage.getItem('cesta'));
    }else{
      this.productosCesta = [];
      this.cesta = {
        productosCesta: this.productosCesta,
        importeTotal: 0,
        importeSubTotal: 0,
        envio: 0,
        cantidadProductos: 0
      }
    }
    let incrementoCantidad: boolean = this.sumarProductosRepetidos(productoCesta);
    if(!incrementoCantidad){
      let productoCestaNuevo: ProductoCesta = productoCesta;
      this.cesta.productosCesta.push(productoCestaNuevo);
    }
    this.calcularImporteTotal();
    window.sessionStorage.setItem('cesta', JSON.stringify(this.cesta))
    this.triggerBotonCesta();
  }

  sumarProductosRepetidos(productoCesta: ProductoCesta): boolean{
    for(let i=0; i<this.cesta.productosCesta.length; i++){
      if(this.cesta.productosCesta[i].producto.id == productoCesta.producto.id && 
        this.cesta.productosCesta[i].producto.saborSeleccionado.id == productoCesta.saborSeleccionado.id){
          let cantidadInicial = this.cesta.productosCesta[i].producto.cantidad;
          let cantidadFinal = productoCesta.producto.cantidad + cantidadInicial;
          this.cesta.productosCesta[i].producto.cantidad = cantidadFinal;
        return true;
      }
    }
    return false;
  }

  actualizarCesta(productsCesta): Cesta{
    this.cesta = {
      productosCesta: productsCesta,
      importeTotal: 0,
      importeSubTotal: 0,
      envio: 0,
      cantidadProductos: 0
    }
    this.calcularImporteTotal();
    window.sessionStorage.setItem('cesta', JSON.stringify(this.cesta))
    return this.cesta;
  }

  calcularImporteTotal(){
    this.importeTotal = 0;
    this.importeSubTotal = 0;
    this.cesta.cantidadProductos = 0;
    for(let productCesta of this.cesta.productosCesta){
      this.importeSubTotal += (productCesta.cantidad * this.ConvertStringToNumber(productCesta.producto.precio));
      this.cesta.cantidadProductos += productCesta.cantidad;
    }
    this.cesta.importeSubTotal = this.importeSubTotal;

    if(this.importeSubTotal >= 25){
      this.envio = 0;
    }else{
      this.envio = 4.95;
    }
    this.cesta.envio = this.envio;

    this.importeTotal = this.importeSubTotal + this.envio;
    this.cesta.importeTotal = this.importeTotal;
    this.comprobarCarritoVacio();
    
  }

  comprobarCarritoVacio(){
    if(this.cesta.productosCesta.length > 0){
      this.carritoVacio = false;
    }else{
      this.carritoVacio = true;
    }
    this.store.dispatch(actionSettingsCarritoVacio({
      carritoEstaVacio: this.carritoVacio
    }))
  }

  ConvertStringToNumber(input: string) {
    var numeric = Number(input);
    return numeric;
  }

  getProductosCesta(): Cesta{
    if(sessionStorage.getItem('cesta')){
      this.cesta =  JSON.parse(sessionStorage.getItem('cesta'));
    }else{
      this.productosCesta = [];
      this.cesta = {
        productosCesta: this.productosCesta
      }
    } 
    this.calcularImporteTotal();
    //this.saveUserCartBbdd();
    return this.cesta;
  }

  removeProductoCesta(index: number): Cesta{
    if(sessionStorage.getItem('cesta')){
      this.cesta =  JSON.parse(sessionStorage.getItem('cesta'));
      let productCesta = this.cesta.productosCesta[index];
      this.cesta.productosCesta.splice(index, 1);
      this.cesta.cantidadProductos--;
      this.calcularImporteTotal();
      window.sessionStorage.setItem('cesta', JSON.stringify(this.cesta))
    }
    return this.cesta;
  }

  saveUserCartBbdd(){
    if(window.sessionStorage.getItem('authenticated') == 'true'){
      let usuario: User = JSON.parse(window.sessionStorage.getItem('auth-user'));
      this.cesta.usuario = usuario;
      return this.httpClient.post<Cesta>(
        `${PEDIDO_API}saveCesta`,
        this.cesta
      ).subscribe();
    }
  }

  getUserCartBbdd(){
    if(window.sessionStorage.getItem('authenticated') == 'true'){
      let usuario: User = JSON.parse(window.sessionStorage.getItem('auth-user'));
        return this.httpClient.get<Cesta>(`${PEDIDO_API}obtenerCesta?idUsuario=${usuario.id}`);
    }
  }

  triggerBotonCesta(){
    let botonCesta: HTMLElement = document.getElementById('botonShoppingCart') as HTMLElement;
    let contenedorCestaNormal: HTMLElement = document.getElementById('divRegistro') as HTMLElement;
    if(this.isElementVisible(contenedorCestaNormal)){
      setTimeout(() => {
        botonCesta.click();
      }, 1000);
    }
   
    let botonCestaMobile: HTMLElement = document.getElementById('botonShoppingCartMobile') as HTMLElement;
    let contenedorCestaMobile: HTMLElement = document.getElementById('cestaIconMobile') as HTMLElement;
    if(this.isElementVisible(contenedorCestaMobile)){
      setTimeout(() => {
        botonCestaMobile.click();
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
  cambiarBreadcrumb(nombre: string, nombreEng: string){
    this.store.dispatch(actionSettingsNombreBreadcrumb({
      nombreBreadcrumbFinal: nombre
    }))
    this.store.dispatch(actionSettingsNombreBreadcrumbEng({
      nombreBreadcrumbFinalEng: nombreEng
    }))
  } 

}
