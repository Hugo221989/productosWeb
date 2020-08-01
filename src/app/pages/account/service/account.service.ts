import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import spainCities from '../../../../assets/spainCities/spainCities.json';
import { SpainCities } from 'src/app/models/spainCities';
import { Observable } from 'rxjs';
import { User, Genero, UsuarioDireccion } from '../../../models/user';
import { Pedido } from '../../../models/pedido';
import { throwError } from 'rxjs';
import { imageProfile } from 'src/app/models/imageProfile';
import { environment } from 'src/environments/environment';

const USER_API = `${environment.urlAPI}usuario/`;
const USER_DIR_API = `${environment.urlAPI}usuarioDireccion/`;
const ORDER_API = `${environment.urlAPI}pedido/`;
const IMG_API = `${environment.urlAPI}image/`;

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  public countryList:SpainCities[] = spainCities;

  constructor(private httpClient: HttpClient) { }

  public getCities() {
    spainCities.sort((a, b) => (a.city > b.city) ? 1 : -1)
    return spainCities;
  }

  getUserInfo(email: string): Observable<any> {
    return this.httpClient.get<User>(`${USER_API}obtenerUsuario?email=${email}`);
  }

  actualizarUsuario(usuario: User){
    return this.httpClient.put(
      `${USER_API}editarUsuario`,
      usuario
    );
  }

  uploadProfilePhoto(uploadImageData: any){
    return this.httpClient.post(
      `${IMG_API}upload`,
      uploadImageData, {
        reportProgress: true,
        observe: 'events' 
      }
    );
  }

  getProfileImage(fileName: string){
    return this.httpClient.get<imageProfile>(
      `${IMG_API}getImage/${fileName}`
    )
  }

  crearDireccionUsuario(usuarioDireccion: UsuarioDireccion, email: string){
    return this.httpClient.post<User>(
      `${USER_DIR_API}crearUsuarioDireccion?email=${email}`,
      usuarioDireccion
    );
  }

  getGeneros(){
    return this.httpClient.get<Genero[]>(`${USER_API}obtenerGeneros`);
  }

  getOrders(idUsuario: number): Observable<Pedido[]> {
    return this.httpClient.get<Pedido[]>(`${ORDER_API}obtenerPedidosByUsuarioId?idUsuario=${idUsuario}`);
  }

  // Error handling
  errorHandl(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = error.error.code;
    }
    //console.log(errorMessage);
    return throwError(errorMessage);
  }

}
