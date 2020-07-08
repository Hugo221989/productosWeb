import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SettingsState } from 'src/app/settings/settings.model';
import { ProductsService } from '../../products-page/service/products.service';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { actionSettingsBuscador } from 'src/app/settings/settings.actions';
import { selectSettingsBuscador } from 'src/app/settings/settings.selectors';
import { UsuarioDireccion } from '../../../models/user';
import { TokenStorageService } from '../../login/logn-service/token-storage.service';
import { AccountService } from '../../account/service/account.service';
import { CestaService } from '../service/cesta.service';
import { MetodoEnvio, MetodoPago } from 'src/app/models/cesta';
import { FormGroup } from '@angular/forms';
import { myAnimation } from 'src/app/animations/animation';

@Component({
  selector: 'app-cesta-paso2',
  templateUrl: './cesta-paso2.component.html',
  styleUrls: ['./cesta-paso2.component.scss'],
  animations: [myAnimation]
})
export class CestaPaso2Component implements OnInit, OnDestroy{

  language: string = "es";
  textoBuscador: string = null;
  contenedorBusquedaProducto: boolean = false;
  textoBuscadorOvservable$: Observable<string>;
  private subscription: Subscription[] = [];
  blockedDocument: boolean = true;
  productLoaded: Promise<boolean>;
  direccion: UsuarioDireccion;
  metodoEnvio: MetodoEnvio;
  metodoPago: MetodoPago;
  email: string = null;
  selectedEnvio: number = 2;
  selectedPago: number = 2; 

  constructor(private router:Router,
    private productsService: ProductsService,
    private store: Store<{settings: SettingsState}>,
    public translate: TranslateService,
    private accountService: AccountService,
    private cestaService: CestaService,
    private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.getLanguageBrowser();
    this.manageBuscadorSuperior();
    this.obtenerUsuario();
    this.obtenerMetodoEnvio();
    this.obtenerMetodoPago();
    this.gotoTop();
    this.unblockScreen();
  }

  private obtenerUsuario(){
    if(this.tokenStorageService.getEmail() != null){
      this.email = this.tokenStorageService.getEmail();
      this.accountService.getUserInfo(this.email).subscribe( data =>{
        if(data){
          this.direccion = data.direccion;
        }
      })
    }else{
      this.router.navigate(['cart','paso1']);
    }
  }

  private obtenerMetodoEnvio(){
    this.cestaService.getMetodosEnvio().subscribe(data => {
      this.metodoEnvio = data;
    })
  }
  private obtenerMetodoPago(){
    this.cestaService.getUMetodospago().subscribe(data => {
      this.metodoPago = data;
    })
  }

  getLanguageBrowser(){
    this.language = this.productsService.getLanguageBrowser();
    }

  manageBuscadorSuperior(){
    /*para el buscador*/
    this.store.dispatch(actionSettingsBuscador({
      buscador: null
    })) 
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

  paso3(){
    this.router.navigate(['cart','paso3']);
  }

  unblockScreen(){
    this.blockedDocument = true;
    setTimeout(() => {
      this.blockedDocument = false;
      this.productLoaded = Promise.resolve(true); 
    }, 1000);
  }

  gotoTop() {
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
