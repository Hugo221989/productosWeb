import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaPadre, CategoriaPadreDto } from 'src/app/models/categoria';
import { TranslateCacheService } from 'ngx-translate-cache';
import { TranslateService } from '@ngx-translate/core';

const CATEGORIA_API = 'http://localhost:8182/restfull/categoria/';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  browserLang: string = "es";

  constructor(private httpClient: HttpClient, translateCacheService: TranslateCacheService, translate: TranslateService) { 

    this.browserLang = translateCacheService.getCachedLanguage() || translate.getBrowserLang();
  }

  getCategoriaPadre(categoriaPadreKey: string): Observable<any> {
    return this.httpClient.get<CategoriaPadreDto>(`${CATEGORIA_API}obtenerCategoriaPadreByKey?idCategoriaPadre=${categoriaPadreKey}&language=${this.browserLang}`);
  }
}
