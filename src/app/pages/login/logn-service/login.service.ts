import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


const AUTH_API = 'http://localhost:8182/restfull/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private isRegistrationSended = new Subject<boolean>();
  private isLoginToRegisterSwitched = new Subject<boolean>();

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
      password: user.passwordReg,
      language: user.language
    }, httpOptions);
  }

  checkActivationUserToken(token: string): Observable<any> {
    return this.httpClient.get(`AUTH_API/activarUsuarioRegistrado?token=${token}`);
  }

  setRegistrationEmailSended(){
    this.isRegistrationSended.next(true);
  }

  isRegistrationEmailSended(): Observable<boolean>{
    return this.isRegistrationSended.asObservable();
  }

  switchLoginToRegisterModal(){
    this.isLoginToRegisterSwitched.next(true);
  }

  isLoginSwitchedToRegistrationModal(): Observable<boolean>{
    return this.isLoginToRegisterSwitched.asObservable();
  }

}
