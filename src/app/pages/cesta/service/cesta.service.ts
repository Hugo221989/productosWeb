import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MetodoEnvio, MetodoPago } from 'src/app/models/cesta';
import { environment } from 'src/environments/environment';

const ORDER_API = `${environment.urlAPI}pedido/`;

@Injectable({
  providedIn: 'root'
})
export class CestaService {

  constructor(private httpClient: HttpClient) { }

  getMetodosEnvio(): Observable<any> {
    return this.httpClient.get<MetodoEnvio>(`${ORDER_API}obtenerMetodosEnvio`);
  }
  getUMetodospago(): Observable<any> {
    return this.httpClient.get<MetodoPago>(`${ORDER_API}obtenerMetodosPago`);
  }
}
