import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { User } from 'src/app/models/user';
import {SelectItem} from 'primeng/api';
import {MessageService} from 'primeng/api';

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
  usuario: User;
  email: string;
  password: string;

 /* constructor(private router:Router,
              private fb: FormBuilder) {
 
                this.profileForm = this.fb.group({
                  login: ['', [Validators.required, Validators.minLength(2)]],
                  email: ['', [Validators.required, Validators.email]],
                  nombre: ['', [Validators.required, Validators.minLength(2)]],
                  apellido: ['', [Validators.required, Validators.minLength(2)]],
                  creacion: ['', [Validators.required]],
                  ciudad: ['', [Validators.required, Validators.minLength(2)]],
                  direccion: ['', [Validators.required, Validators.minLength(2)]],
                  nacimiento: ['', Validators.required],
                  constrasena: ['', Validators.required],
                })

              }

  onSubmit() {
    console.log(this.email);
    console.log(this.password);
    this.llenarLogin();
  }

  llenarLogin(){
    this.usuario.email = this.profileForm.value.email;
    this.usuario.constrasena = this.profileForm.value.constrasena;
  } */


  userform: FormGroup;

    submitted: boolean;

    genders: SelectItem[];

    description: string;

    constructor(private fb: FormBuilder, private messageService: MessageService, private router:Router) {}

    ngOnInit() {
        this.userform = this.fb.group({
            'email': new FormControl('', Validators.required),
            'lastname': new FormControl('', Validators.required),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
            'description': new FormControl(''),
            'gender': new FormControl('', Validators.required),
            'rememberLogin': new FormControl(false)
        });

        this.genders = [];
        this.genders.push({label:'Select Gender', value:''});
        this.genders.push({label:'Male', value:'Male'});
        this.genders.push({label:'Female', value:'Female'});
    }

    onSubmit(value: string) {
        this.submitted = true;
        this.messageService.add({severity:'info', summary:'Success', detail:'Form Submitted'});
    }

    get diagnostic() { return JSON.stringify(this.userform.value); }

  irHome(){
    this.router.navigateByUrl('home');
  }

}
