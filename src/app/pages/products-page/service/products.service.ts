import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from 'src/app/models/producto';
import { Sabor } from 'src/app/models/productoOtrosDatos';
import { Cesta } from 'src/app/models/cesta';

const USER_API = 'http://localhost:8182/restfull/usuario/';
const PRODUCT_API = 'http://localhost:8182/restfull/producto/';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  cesta: Cesta;

  constructor(private httpClient: HttpClient) { }

  getProductsList(): Observable<any> {
    return this.httpClient.get<Producto[]>(`${USER_API}obtenerProductos`);
  }

  getProductsListRelacionados(): Observable<any> {
    return this.httpClient.get<Producto[]>(`${PRODUCT_API}obtenerProductosRelacionados`);
  }

  getProductById(idProducto: number): Observable<any> {
    return this.httpClient.get<Producto>(`${USER_API}obtenerProductoById?idProducto=${idProducto}`);
  }

  getSabores(): Observable<any> {
    return this.httpClient.get<Sabor[]>(`${USER_API}obtenerProductoById`);
  }
  
  /* SHOPPING CART */
  addProductToCart(product: Producto){
    if(sessionStorage.getItem('cesta')){
      this.cesta =  JSON.parse(sessionStorage.getItem('cesta'));
    }else{
      this.cesta.productos = [];
    }
    
    this.cesta.productos.push(product);
    window.sessionStorage.setItem('cesta', JSON.stringify(product))
  }

}
