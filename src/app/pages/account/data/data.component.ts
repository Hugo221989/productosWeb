import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/api/selectitem';
import { MessageService } from 'primeng/api';
import { AccountService } from '../service/account.service';
import { SpainCities } from 'src/app/models/spainCities';
import { TokenStorageService } from '../../login/logn-service/token-storage.service';
import { User, Genero, UsuarioDireccion } from '../../../models/user';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, Observable } from 'rxjs';
import { selectSettingsBuscador } from 'src/app/settings/settings.selectors';
import { SettingsState } from 'src/app/settings/settings.model';
import { Store, select } from '@ngrx/store';
import { HttpEventType } from '@angular/common/http';
import { imageProfile } from 'src/app/models/imageProfile';
import {Message} from 'primeng/api';
import { myAnimation } from 'src/app/animations/animation';
import { ProductsService } from '../../products-page/service/products.service';

const TOAST_MILISECONDS_REMAINING = 4000;

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
  providers: [MessageService, DatePipe],
  animations: [myAnimation]
})
export class DataComponent implements OnInit, OnDestroy {

  language: string = "es";
  emailTokenStorage: string = null;
  usuario: User;
  userform: FormGroup;
  adressform: FormGroup;
  deleteAccountform: FormGroup;
  gendersComboBox: SelectItem[];
  genders: Genero[];
  selectedGender: Genero;
  userAdress: UsuarioDireccion
  submitted: boolean;
/*IMAGE*/
fileData: File = null;
previewUrl:any = null;
fileUploadProgress: number = 0;
uploadedFilePath: string = null;

spainCitiesComboBox: SelectItem[] = [];
spainCitiesList:SpainCities[] = [];
spainCitySelected: SpainCities;

private subscription: Subscription[] = [];
textoBuscadorOvservable$: Observable<string>;
textoBuscador: string = null;
contenedorBusquedaProducto: boolean = false;

retrieveResponse: imageProfile;
retrievedImage: any;
base64Data: any;
msgs: Message[] = [];
  
  constructor(private fb: FormBuilder,
              private accountService: AccountService,
              private tokenStorageService: TokenStorageService,
              public translate: TranslateService,
              private messageService: MessageService,
              private productsService: ProductsService,
              private store: Store<{settings: SettingsState}>) { }

  ngOnInit(): void {
        this.getLanguageBrowser();
        this.initUserForm();
        this.initAddressForm();
        this.initDeleteAccountForm();
        this.manageBuscadorTextoSuperior();
        this.getCities();
        this.getGenders();
        this.loadTranslatedLabels();
        this.gotoTopPage();
  }

  private getUserInformation(){
    this.emailTokenStorage = this.tokenStorageService.getEmail();
    this.accountService.getUserInfo(this.emailTokenStorage).subscribe( data =>{
      if(data){
        let date2 = data.nacimiento;

        this.usuario = data;
        this.userform.controls['name'].setValue(data.nombre);
        this.userform.controls['lastname'].setValue(data.apellido);
        this.userform.controls['date'].setValue(date2);
        this.userform.controls['email'].setValue(data.email);
        this.userform.controls['phone'].setValue(data.telefono);
        if(data.genero){
          this.selectedGender = this.genders.find(x => x.id == data.genero.id);
          this.userform.controls['gender'].patchValue(this.selectedGender);
        }
        this.getUserAddress(data);
        this.getUserProfileImage();
      }
    })
  }

  private getUserAddress(data: any){
    let direccion: UsuarioDireccion;
    direccion = data.direccion;
    this.adressform.controls['destinatari'].setValue(direccion.destinatario);
    this.adressform.controls['street'].setValue(direccion.calle);
    this.adressform.controls['streetNum'].setValue(direccion.piso);
    this.adressform.controls['aditionalData'].setValue(direccion.datosAdicionales);
    this.adressform.controls['postCode'].setValue(direccion.codigoPostal);
    if(direccion.localidad){
      this.spainCitySelected = this.spainCitiesList.find(x => x.city == direccion.localidad);
      this.adressform.controls['locality'].patchValue(this.spainCitySelected.city);
    }
    this.adressform.controls['phone'].setValue(direccion.telefono); 
  }

  form(){
    console.log(this.userform);
  }
  saveUserInDatabase(){
    this.fillUserObjectFrom();
    this.accountService.actualizarUsuario(this.usuario).subscribe(data=>{
      if(data){
        this.messageService.add({severity:'info', summary: this.successUserSavedLabel, life: TOAST_MILISECONDS_REMAINING});
      }
    });
  }
  saveAddressInDatabase(){
    this.fillUserAddressObject();
    this.accountService.crearDireccionUsuario(this.userAdress, this.usuario.email).subscribe(data => {
      if(data){
        this.messageService.add({severity:'info', summary: this.successAddressSavedLabel, life: TOAST_MILISECONDS_REMAINING});
      }
    });
  }

  private fillUserObjectFrom(){
    this.usuario.nombre = this.userform.value.name;
    this.usuario.apellido = this.userform.value.lastname;
    this.usuario.nacimiento = this.userform.value.date;
    this.usuario.email = this.userform.value.email;
    this.usuario.telefono = this.userform.value.phone;
    this.usuario.genero = this.userform.value.gender;
  }

  private fillUserAddressObject(){
    this.userAdress = {
      destinatario : this.adressform.value.destinatari,
      calle : this.adressform.value.street,
      piso : this.adressform.value.streetNum,
      codigoPostal : this.adressform.value.postCode,
      localidad : this.adressform.value.locality,
      telefono : this.adressform.value.phone,
      datosAdicionales : this.adressform.value.aditionalData
    }
  }

  private getGenders(){
    this.accountService.getGeneros().subscribe( data =>{
      this.genders = data;
      this.gendersComboBox = [];
      for(let genero of this.genders){
        this.gendersComboBox.push({label:genero.nombre, value:genero});
      }
      this.getUserInformation();
    })
  }

  private getCities(){
      this.spainCitiesList = this.accountService.getCities();
      for(let city of this.spainCitiesList){
        this.spainCitiesComboBox.push({label:city.city, value:city.city})
      }
  }

  onUploadUserPhoto(event){
    this.fileData = event.files[0];
    this.previewUploadedPhoto();
  } 
  removeFileData(){
    this.fileData = null;
    this.getUserProfileImage();
  }

  fileProgress(fileInput: any) {
    //this.fileData = <File>fileInput.target.files[0];
    this.previewUploadedPhoto();
}

  previewUploadedPhoto() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
 
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      this.previewUrl = reader.result; 
    }
}
 
onProfileImageSubmit() {
    const uploadImageData = new FormData();
    const fileName = this.usuario.usuario+'_foto';
    uploadImageData.append('imageFile', this.fileData, fileName);
      this.accountService.uploadProfilePhoto(uploadImageData).subscribe(resp =>{
        if(resp.type === HttpEventType.UploadProgress) {
          this.fileUploadProgress = Math.round(resp.loaded / resp.total * 100);
        } else if(resp.type === HttpEventType.Response) {
          this.fileUploadProgress = 0;
          this.removeFileData();      
          this.showSuccesUploadMessage();
        }
      });
}

getUserProfileImage(){
  const fileName = this.usuario.usuario+'_foto';
  this.accountService.getProfileImage(fileName).subscribe( data =>{
    this.retrieveResponse = data;
    this.base64Data = this.retrieveResponse.picByte;
    this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
    this.previewUrl = this.retrievedImage;
    //this.uploadedFiles.push(this.retrievedImage);
  })
}
showSuccesUploadMessage(){
 /*  this.msgs = [];
  this.msgs.push({severity:'info', summary: this.successPhotoUploadLabel});
  setTimeout(() => {
    this.msgs = [];
  }, 1500); */
  this.messageService.add({severity:'info', summary: this.successPhotoUploadLabel});
}

  saveAdressInfo(adress:string){

  }

  manageBuscadorTextoSuperior(){
  /*para el buscador*/
  this.textoBuscadorOvservable$ = this.store.pipe(select(selectSettingsBuscador));
  this.subscription.push(this.textoBuscadorOvservable$.subscribe( (texto) => {
      this.textoBuscador = texto;
      if(this.textoBuscador != null && this.textoBuscador != ''){
        this.contenedorBusquedaProducto = true;
      }else{
        this.contenedorBusquedaProducto = false;
      }
  }))
}

initUserForm(){
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
}

initAddressForm(){
  this.adressform = this.fb.group({
    'destinatari': new FormControl('', Validators.required),
    'street': new FormControl('', Validators.required),
    'streetNum': new FormControl('', Validators.required),
    'aditionalData': new FormControl(''),
    'postCode': new FormControl('', Validators.required),
    'locality': new FormControl('', Validators.required),
    'phone': new FormControl('', Validators.compose([Validators.required, Validators.minLength(9)]))
  });
}

initDeleteAccountForm(){
  this.deleteAccountform = this.fb.group({
    'razones' : new FormControl('')
  })
}

  private successUserSavedLabel: string = "";
  private successAddressSavedLabel: string = "";
  private successPhotoUploadLabel: string = "";
  loadTranslatedLabels(){
    this.subscription.push(this.translate.getTranslation(this.language).subscribe(data=>{
      this.successUserSavedLabel = data['usuario.guardado.correctamente'];
      this.successAddressSavedLabel = data['direccion.guardada.correctamente'];
      this.successPhotoUploadLabel = data['foto.subida.correctamente'];
    })
    );
  }

  getLanguageBrowser(){
    this.language = this.productsService.getLanguageBrowser();
  }

  gotoTopPage() {
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

  ngOnDestroy(){
    this.subscription.forEach(s => s.unsubscribe());
  }
}
