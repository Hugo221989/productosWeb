import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


const AUTH_API = 'http://localhost:8182/restfull/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiURL: string;

  constructor(private httpClient: HttpClient) { }


  login(credentials): Observable<any> {
    return this.httpClient.post(AUTH_API + 'signin', {
      username: credentials.username,
      password: credentials.password,
      rememberLogin: credentials.rememberLogin
    }, httpOptions);
  }

  register(user): Observable<any> {
    return this.httpClient.post(AUTH_API + 'signup', {
      username: user.usernameReg,
      email: user.emailReg,
      password: user.passwordReg
    }, httpOptions);
  }

}
