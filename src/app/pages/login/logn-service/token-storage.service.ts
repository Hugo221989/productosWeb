import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const REMEMBER_KEY = 'remember-login';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signOut() {
    window.sessionStorage.clear();
    if(!this.isRememberLogin()){
      window.sessionStorage.removeItem(TOKEN_KEY);
      window.sessionStorage.removeItem(USER_KEY);
    }
  }

  public saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user) {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser() {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }

  public getEmail(){
    let user = JSON.parse(sessionStorage.getItem(USER_KEY));
    if(user == null)return null;
    return user['email'];
  }
  public rememberLogin(remember: boolean){
    window.sessionStorage.setItem(REMEMBER_KEY, JSON.stringify(remember));
  }

  public isRememberLogin():boolean{
    let rem = window.sessionStorage.getItem(REMEMBER_KEY);
    if(rem != null && rem == 'true'){
      return true;
    }
    return false;
  }

}
