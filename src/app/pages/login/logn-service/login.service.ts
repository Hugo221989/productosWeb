import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiURL: string;

  constructor(private httpClient: HttpClient) { }


  login(user: User){
    console.log(user);
    
  }
 /*  login(user: User): Observable<any> {
    return this.httpClient.post("https://reqres.in/api/login", user);
  } */

}
