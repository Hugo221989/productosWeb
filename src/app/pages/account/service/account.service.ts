import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import spainCities from '../../../../assets/spainCities/spainCities.json';
import { SpainCities } from 'src/app/models/spainCities';
import { Observable } from 'rxjs';
import { User, Genero, UsuarioDireccion } from '../../../models/user';


const USER_API = 'http://localhost:8182/restfull/usuario/';
const USER_DIR_API = 'http://localhost:8182/restfull/usuarioDireccion/';

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

  crearDireccionUsuario(usuarioDireccion: UsuarioDireccion, email: string){
    return this.httpClient.post<User>(
      `${USER_DIR_API}crearUsuarioDireccion?email=${email}`,
      usuarioDireccion
    );
  }

  getGeneros(){
    return this.httpClient.get<Genero[]>(`${USER_API}obtenerGeneros`);
  }

}
