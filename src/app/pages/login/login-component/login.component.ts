import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { User } from 'src/app/models/user';
import {MessageService} from 'primeng/api';
import { LoginService } from '../logn-service/login.service';
import { TokenStorageService } from '../logn-service/token-storage.service';
import { actionSettingsIsAuthenticated } from 'src/app/settings/settings.actions';
import { SettingsState } from 'src/app/settings/settings.model';
import { Store } from '@ngrx/store';
import { ProductsService } from '../../products-page/service/products.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [
    MessageService
  ]
})
export class LoginComponent {

  public profileForm: FormGroup;
  public usuario: User;
  public email: string;
  public password: string;
  public form: any = {};
  public isLoggedIn = false;
  public isLoginFailed = false;
  public errorMessage = '';
  public roles: string[] = [];
  public userform: FormGroup;
  public submitted: boolean;
  public description: string;
  public isIncorrectLoginCredentials: boolean = false;

    constructor(private fb: FormBuilder, private messageService: MessageService, private router:Router, private productosService: ProductsService,
      private loginService: LoginService, private tokenStorage: TokenStorageService, private store: Store<{settings: SettingsState}>,
      public translate: TranslateService) {}

    ngOnInit() {

      if (this.tokenStorage.getToken()) {
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
      }
      this.createUserForm();
        if(this.tokenStorage.isRememberLogin()){

        }
    }

    createUserForm(){
      this.userform = this.fb.group({
        'email': new FormControl('', Validators.required),
        'lastname': new FormControl('', Validators.required),
        'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
        'description': new FormControl(''),
        'gender': new FormControl('', Validators.required),
        'rememberLogin': new FormControl(false)
    });
    }

    onSubmit() {
        this.submitted = true;
        //this.messageService.add({severity:'info', summary:'Success', detail:'Form Submitted'});
        this.loginService.login(this.form).subscribe(
          data => {
            this.dispatchUserAuthentication();
            this.saveUserAndTokenInStorage(data);
            this.setLoginVariables();
            this.setUserRoles();
            this.getUserCart(this.form.username);
            this.reloadPage();
          },
          err => {
            this.setErrorLogin(err);
          }
        );
    }

    dispatchUserAuthentication(){
      this.store.dispatch(actionSettingsIsAuthenticated({
        isAuthenticated: true
      }))
    }

    saveUserAndTokenInStorage(data: any){
      this.tokenStorage.saveToken(data.accessToken);
      this.tokenStorage.saveUser(data);
      this.tokenStorage.rememberLogin(data.rememberLogin);
    }

    setLoginVariables(){
      this.isLoginFailed = false;
      this.isLoggedIn = true;
    }

    setUserRoles(){
      this.roles = this.tokenStorage.getUser().roles;  
    }

    setErrorLogin(err: any){
      this.errorMessage = err.error.message;
      this.isLoginFailed = true;
      this.isIncorrectLoginCredentials = true;
    }

    switchLoginToRegisterModal(){
      this.loginService.switchLoginToRegisterModal();
    }

    reloadPage() {
      window.location.reload();
    }

    get diagnostic() { return JSON.stringify(this.userform.value); }

    irHome(){
      this.router.navigateByUrl('home');
    }

    getUserCart(username: string){
      this.productosService.getUserCartBbdd(username).subscribe(data => {
        window.sessionStorage.setItem('cesta', JSON.stringify(data));
      })
    }

}
