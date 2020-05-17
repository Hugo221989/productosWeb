import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, CatProductoDto } from 'src/app/models/producto';
import { Sabor } from 'src/app/models/productoOtrosDatos';
import { Cesta } from 'src/app/models/cesta';
import { SettingsState } from 'src/app/settings/settings.model';
import { Store } from '@ngrx/store';
import { actionSettingsCarritoVacio } from 'src/app/settings/settings.actions';

const USER_API = 'http://localhost:8182/restfull/usuario/';
const PRODUCT_API = 'http://localhost:8182/restfull/producto/';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  cesta: Cesta;
  productos: Producto[];
  importeTotal: number;
  importeSubTotal: number;
  envio: number;
  carritoVacio: boolean = true;

  constructor(private httpClient: HttpClient, private store: Store<{settings: SettingsState}>) { }

  getProductsList(buscador: string): Observable<any> {
    return this.httpClient.get<Producto[]>(`${USER_API}obtenerProductos?buscador=${buscador}`);
  }

  getProductsListBySubCat(subCategoria: string): Observable<any> {
    if(subCategoria == 'all'){
      subCategoria = null;
    }
    return this.httpClient.get<Producto[]>(`${USER_API}obtenerProductosBySubCategoria?subCategoria=${subCategoria}`);
  }

  getProductsListByCat(categoria: string): Observable<any> {
    if(categoria == 'all'){
      categoria = null;
    }
    return this.httpClient.get<Producto[]>(`${USER_API}obtenerProductosByCategoria?categoria=${categoria}`);
  }
  getProductsListByCatPadre(categoriaPadre: number): Observable<any> {
    return this.httpClient.get<Producto[]>(`${USER_API}obtenerProductosByCategoriaPadre?categoriaPadre=${categoriaPadre}`);
  }


  getProductsListRelacionados(): Observable<any> {
    return this.httpClient.get<Producto[]>(`${PRODUCT_API}obtenerProductosRelacionados`);
  }

  getProductById(idProducto: number): Observable<any> {
    return this.httpClient.get<Producto>(`${USER_API}obtenerProductoById?idProducto=${idProducto}`);
  }

  getCatSubCatProduct(idProducto: number){
    return this.httpClient.get<CatProductoDto>(`${PRODUCT_API}obtenerCatAndSubCatByProductoId?idProducto=${idProducto}`);
  }

  getSabores(): Observable<any> {
    return this.httpClient.get<Sabor[]>(`${USER_API}obtenerProductoById`);
  }
  
  /* SHOPPING CART */
  addProductToCart(product: Producto){
    if(sessionStorage.getItem('cesta')){
      this.cesta =  JSON.parse(sessionStorage.getItem('cesta'));
    }else{
      this.productos = [];
      this.cesta = {
        productos: this.productos,
        importeTotal: 0,
        importeSubTotal: 0,
        envio: 0
      }
    }
    let incrementoCantidad: boolean = this.sumarProductosRepetidos(product);
    if(!incrementoCantidad){
      this.cesta.productos.push(product);
    }
    this.calcularImporteTotal();
    window.sessionStorage.setItem('cesta', JSON.stringify(this.cesta))
    this.triggerBotonCesta();
  }

  sumarProductosRepetidos(product: Producto): boolean{
    for(let i=0; i<this.cesta.productos.length; i++){
      if(this.cesta.productos[i].id == product.id && this.cesta.productos[i].saborSeleccionado == product.saborSeleccionado){
        let cantidadInicial = this.cesta.productos[i].cantidad;
        let cantidadFinal = product.cantidad + cantidadInicial;
        this.cesta.productos[i].cantidad = cantidadFinal;
        
        return true;
      }
    }
    return false;
  }

  calcularImporteTotal(){
    this.importeTotal = 0;
    this.importeSubTotal = 0;
    for(let product of this.cesta.productos){
      this.importeSubTotal += (product.cantidad * this.ConvertStringToNumber(product.precio));
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
    if(this.cesta.productos.length > 0){
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
      this.productos = [];
      this.cesta = {
        productos: this.productos
      }
    } 
    this.calcularImporteTotal();
    return this.cesta;
  }

  removeProductoCesta(index: number): Cesta{
    if(sessionStorage.getItem('cesta')){
      this.cesta =  JSON.parse(sessionStorage.getItem('cesta'));
      let product = this.cesta.productos[index];
      this.cesta.productos.splice(index, 1);
      this.calcularImporteTotal();
      window.sessionStorage.setItem('cesta', JSON.stringify(this.cesta))
    }
    return this.cesta;
  }

  triggerBotonCesta(){
    let botonCesta: HTMLElement = document.getElementById('botonShoppingCart') as HTMLElement;
    let contenedorCestaNormal: HTMLElement = document.getElementById('divRegistro') as HTMLElement;
    if(this.isElementVisible(contenedorCestaNormal)){console.log("BOTON NORMAL: ")
      setTimeout(() => {
        botonCesta.click();
      }, 1000);
    }
   
    let botonCestaMobile: HTMLElement = document.getElementById('botonShoppingCartMobile') as HTMLElement;
    let contenedorCestaMobile: HTMLElement = document.getElementById('cestaIconMobile') as HTMLElement;
    if(this.isElementVisible(contenedorCestaMobile)){console.log("BOTON MOBILE: ")
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

}
