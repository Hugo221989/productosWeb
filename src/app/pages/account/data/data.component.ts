import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/api/selectitem';
import { FileUpload } from 'primeng/fileupload/fileupload';
import { MessageService } from 'primeng/api';
import { AccountService } from '../service/account.service';
import { SpainCities } from 'src/app/models/spainCities';
import { TokenStorageService } from '../../login/logn-service/token-storage.service';
import { User, Genero, UsuarioDireccion } from '../../../models/user';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
  providers: [MessageService, DatePipe]
})
export class DataComponent implements OnInit {

  email: string = null;
  usuario: User;
  date: string;
  userform: FormGroup;
  adressform: FormGroup;
  deleteAccountform: FormGroup;
  genders: SelectItem[];
  generos: Genero[];
  generoSelected: Genero;
  direccionUpdated: UsuarioDireccion
  submitted: boolean;
  selectedImage = null;
  uploadedFiles: any[] = [];
  countryList:SpainCities[] = [];
  locality: SpainCities = {
    "city": "Madrid", 
    "admin": "Madrid", 
    "country": "Spain", 
    "population_proper": "50437", 
    "iso2": "ES", 
    "capital": "primary", 
    "lat": "40.412752", 
    "lng": "-3.707721", 
    "population": "5567000"
};
  
  constructor(private fb: FormBuilder,
              private messageService: MessageService,
              private accountService: AccountService,
              private tokenStorageService: TokenStorageService,
              public translate: TranslateService) { }

  ngOnInit(): void {

        this.userform = this.fb.group({
            'email': new FormControl('', Validators.required),
            'name': new FormControl('', Validators.required),
            'lastname': new FormControl('', Validators.required),
            /* 'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])), */
            'description': new FormControl(''),
            'gender': new FormControl('', Validators.required),
            'rememberLogin': new FormControl(false),
            'date': new FormControl('', Validators.required),
            'phone' : new FormControl('', Validators.compose([Validators.required, Validators.minLength(9)]))
        });

        this.adressform = this.fb.group({
            'destinatari': new FormControl('', Validators.required),
            'street': new FormControl('', Validators.required),
            'streetNum': new FormControl('', Validators.required),
            'aditionalData': new FormControl(''),
            'postCode': new FormControl('', Validators.required),
            'locality': new FormControl('', Validators.required),
            'phone': new FormControl('', Validators.compose([Validators.required, Validators.minLength(9)]))
        });

        this.deleteAccountform = this.fb.group({
          'razones' : new FormControl('')
        })

        this.getCities();
        this.obtenerGeneros();
        this.obtenerUsuario();
        

  }

  private obtenerUsuario(){
    this.email = this.tokenStorageService.getEmail();
    this.accountService.getUserInfo(this.email).subscribe( data =>{
      if(data){
        let date2 = data.nacimiento;

        this.usuario = data;
        this.userform.controls['name'].setValue(data.nombre);
        this.userform.controls['lastname'].setValue(data.apellido);
        this.userform.controls['date'].setValue(date2);
        this.userform.controls['email'].setValue(data.email);
        this.userform.controls['phone'].setValue(data.telefono);
        if(data.genero){
          this.generoSelected = this.generos.find(x => x.id == data.genero.id);
          //this.generoSelected = {label:data.genero.nombre, value:data.genero};console.log("GENERO: ",this.generoSelected)
          this.userform.controls['gender'].patchValue(this.generoSelected);
        }
        this.obtenerDireccionUsuario(data);
      }
    })
  }

  private obtenerDireccionUsuario(data: any){
    let direccion: UsuarioDireccion;
    direccion = data.direccion[0];
    this.adressform.controls['destinatari'].setValue(direccion.destinatario);
    this.adressform.controls['street'].setValue(direccion.calle);
    this.adressform.controls['streetNum'].setValue(direccion.piso);
    this.adressform.controls['aditionalData'].setValue(direccion.datosAdicionales);
    this.adressform.controls['postCode'].setValue(direccion.codigoPostal);
    this.adressform.controls['locality'].setValue(direccion.localidad);
    this.adressform.controls['phone'].setValue(direccion.telefono); 
  }

  form(){
    console.log(this.userform);
  }
  guardarUsuario(){
    this.llenarInfoUsuario();
    this.accountService.actualizarUsuario(this.usuario).subscribe();
  }

  guardarDireccion(){
    this.llenarDireccionUsuario();
    this.accountService.crearDireccionUsuario(this.direccionUpdated, this.usuario.email).subscribe();
  }

  private llenarInfoUsuario(){
    this.usuario.nombre = this.userform.value.name;
    this.usuario.apellido = this.userform.value.lastname;
    this.usuario.nacimiento = this.userform.value.date;
    this.usuario.email = this.userform.value.email;
    this.usuario.telefono = this.userform.value.phone;
    this.usuario.genero = this.userform.value.gender;
  }

  private llenarDireccionUsuario(){
    let direccionUserArray: UsuarioDireccion[] = [];
    this.direccionUpdated = {
      destinatario : this.adressform.value.destinatari,
      calle : this.adressform.value.street,
      piso : this.adressform.value.streetNum,
      codigoPostal : this.adressform.value.postCode,
      localidad : this.adressform.value.locality.admin,
      telefono : this.adressform.value.phone,
      datosAdicionales : this.adressform.value.aditionalData
    }

  /*   direccionUserArray.push(direccionUpdated);
    this.usuario.direccion = direccionUserArray; */
  }

  private obtenerGeneros(){
    this.accountService.getGeneros().subscribe( data =>{
      this.generos = data;
      this.genders = [];
      for(let genero of this.generos){
        this.genders.push({label:genero.nombre, value:genero});
      }
    })
  }

  getCities(){
      this.countryList = this.accountService.getCities();
      this.adressform.controls['locality'].patchValue(
        this.countryList
      );
  }

  onUpload(event) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
    
    this.messageService.add({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
}

  saveAdressInfo(adress:string){

  }

}
