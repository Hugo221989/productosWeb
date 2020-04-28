import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/api/selectitem';
import { FileUpload } from 'primeng/fileupload/fileupload';
import { MessageService } from 'primeng/api';
import { AccountService } from '../service/account.service';
import { SpainCities } from 'src/app/models/spainCities';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
  providers: [MessageService]
})
export class DataComponent implements OnInit {

  date: string;
  userform: FormGroup;
  adressform: FormGroup;
  deleteAccountform: FormGroup;
  genders: SelectItem[];
  es: any;
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
              private accountService: AccountService) { }

  ngOnInit(): void {

        this.userform = this.fb.group({
            'email': new FormControl('', Validators.required),
            'name': new FormControl('', Validators.required),
            'lastname': new FormControl('', Validators.required),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
            'description': new FormControl(''),
            'gender': new FormControl('', Validators.required),
            'rememberLogin': new FormControl(false),
            'date': new FormControl('', Validators.required),
            'phone' : new FormControl('', Validators.required)
        });

        this.adressform = this.fb.group({
            'destinatari': new FormControl('', Validators.required),
            'street': new FormControl('', Validators.required),
            'streetNum': new FormControl('', Validators.required),
            'aditionalData': new FormControl('', Validators.required),
            'postCode': new FormControl('', Validators.required),
            'locality': new FormControl('', Validators.required),
            'phone': new FormControl('', Validators.required)
        });

        this.deleteAccountform = this.fb.group({
          'razones' : new FormControl('')
        })




        this.genders = [];
        this.genders.push({label:'Selecciona Sexo', value:''});
        this.genders.push({label:'Masculino', value:'Masculino'});
        this.genders.push({label:'Femenino', value:'Femenino'});

        this.es = {
          firstDayOfWeek: 1,
          dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
          dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
          dayNamesMin: [ "D","L","M","X","J","V","S" ],
            monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
          monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
            today: 'Hoy',
            clear: 'Borrar'
        };
        this.getCities();
        

  }

/*   getAccesToken(){
    this.accountService.getCountryAccesToken().subscribe( (data)=> {
      this.authToken = data.auth_token;
      this.getCities();
    });
  } */

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

  saveUserInfo(user:string){

  }

  saveAdressInfo(adress:string){

  }

}
