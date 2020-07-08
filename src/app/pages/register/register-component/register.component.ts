import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../login/logn-service/login.service';
import { ProductsService } from '../../products-page/service/products.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  email: string;
  password: string;
  confirmPassword: string;

  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  language: string = 'es';

  constructor(private loginService: LoginService, private productsService: ProductsService, public translate: TranslateService) {}
  
  ngOnInit(): void {
  }

  onSubmit() {
    this.getLanguageBrowser();
    this.loginService.register(this.form).subscribe(
      data => {
        if(data){
          console.log(data);
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.showEmailSendedPopUp();
        }else{
          this.isSignUpFailed = true;
        }
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }

  showEmailSendedPopUp(){
    this.loginService.setRegistrationEmailSended();
  }

  getLanguageBrowser(){
    this.language = this.productsService.getLanguageBrowser();
    this.form.language = this.language;
    }
  setLanguageSelected(){

  }

  reloadPage() {
    window.location.reload();
  }

}
