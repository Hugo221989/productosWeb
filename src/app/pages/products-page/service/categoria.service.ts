import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaPadre } from 'src/app/models/categoria';

const CATEGORIA_API = 'http://localhost:8182/restfull/categoria/';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private httpClient: HttpClient) { }

  getCategoriaPadre(idCategoriaPadre: number): Observable<any> {
    return this.httpClient.get<CategoriaPadre>(`${CATEGORIA_API}obtenerCategoriaPadreById?idCategoriaPadre=${idCategoriaPadre}`);
  }
}
