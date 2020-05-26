import { Component, OnDestroy } from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
import {MenuItem, SelectItem} from 'primeng/api';
import { LoginComponent } from './pages/login/login-component/login.component';
import { faPhoneVolume, faShoppingCart, faInfoCircle, faTruck} from '@fortawesome/free-solid-svg-icons';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { filter } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { SettingsState } from './settings/settings.model';
import { selectSettingsNombreBreadcrumb, selectSettingsCarritoEstaVacio, selectSettingsBuscador, selectSettingsNombreBreadcrumbEng } from './settings/settings.selectors';
import { RegisterComponent } from './pages/register/register-component/register.component';
import { actionSettingsIsAuthenticated, actionSettingsBuscador, actionSettingsCambiarLanguage } from './settings/settings.actions';
import { TokenStorageService } from './pages/login/logn-service/token-storage.service';
import { OverlayPanel } from 'primeng/overlaypanel/public_api';
import { Cesta } from './models/cesta';
import { ProductsService } from './pages/products-page/service/products.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService]
})
export class AppComponent implements OnDestroy{
  language: string = "es";

  constructor(public dialogService: DialogService,
              private router:Router,
              private activatedRoute: ActivatedRoute,
              private store: Store<{settings: SettingsState}>,
              private tokenStorage: TokenStorageService,
              private productsService: ProductsService,
              public translate: TranslateService) {
                this.languages()
              }

  faPhoneVolume = faPhoneVolume;
  faShoppingCart = faShoppingCart;
  faInfoCircle = faInfoCircle;
  faTruck = faTruck;
  title = 'productosWeb';
  megaMenuItems: MenuItem[];
  panelMenuItems: MenuItem[];
  breadCrumbItems: MenuItem[];
  displayCartMobile: boolean;
  carritoVacio: boolean = false;
  carritoVacioObservable$: Observable<boolean>;
  refDialog;
  isAuthenticated$: Observable<boolean>;
  logged$:boolean = false;
  nombreProductoBreadcrumb$: Observable<string>;
  nombreString = null;

  cesta: Cesta;
  visibleSidebar1;

  textoBuscadorOvservable$: Observable<string>;
  private subscription: Subscription[] = [];
  inputSearch: string = '';

  countries: SelectItem[];
  selectedLanguage: string = 'es';
  selectedLanguageMobile: SelectItem = {label: 'Español', icon: 'spain.png', value:'es'};

  cambiarIdioma(selectedLanguage){
    this.translate.use(selectedLanguage);
    window.sessionStorage.setItem('language', selectedLanguage);
    setTimeout(() => {
      window.location.reload();
    }, 500);
    
  }

  getSessionLanguage(){
    if(window.sessionStorage.getItem('language')){
      this.language = window.sessionStorage.getItem('language');
    }
  }

    search(event) {
      let textoBuscador: string = event;
        this.store.dispatch(actionSettingsBuscador({
          buscador: textoBuscador
        }))
    }

    showLoginModal() {
        const ref = this.dialogService.open(LoginComponent, {
          header: 'Iniciar Sesión',
          width: '40%',
          dismissableMask: true,
          closeOnEscape: true,
          baseZIndex: 1010
      });
  }
  showLoginModalMobile() {
    this.visibleSidebar1 = false;
    const ref = this.dialogService.open(LoginComponent, {
      header: 'Iniciar Sesión',
      width: '90%',
      dismissableMask: true,
      closeOnEscape: true,
      baseZIndex: 1010
  });
}

  showRegisterModal() {
    const ref = this.dialogService.open(RegisterComponent, {
        header: 'Registrarse',
        width: '40%',
        dismissableMask: true,
        autoZIndex: true,
        closeOnEscape: true,
        baseZIndex: 1010
    });

}
showRegisterModalMobile() {
  this.visibleSidebar1 = false;
  const ref = this.dialogService.open(RegisterComponent, { 
      header: 'Registrarse',
      width: '90%',
      dismissableMask: true,
      autoZIndex: true,
      closeOnEscape: true,
      baseZIndex: 1010
  });

}

  miCuenta(){
    this.router.navigate(['/account/']);
  }

  cerrarSesion(){
    this.store.dispatch(actionSettingsIsAuthenticated({
        isAuthenticated: false
      }))
      this.logged$ = false;
      this.tokenStorage.signOut();
      window.location.reload();
  }

  reloadPage() {
    window.location.reload();
  }


ngOnInit() {
    this.getLanguageBrowser()

    this.cargarLabelsMegaMenu();

    this.checkAuthenticated();

    this.getNombreBreadCrumb();

    this.clearSearchinput();

    /*MEGA MENU*/
    setTimeout(() => {
      this.createMegaMenu();
    }, 500);
    
    /*MEGA MENU*/

    /*BREADCRUMB*/ 
    this.router.events.pipe(
        filter(
            event => event instanceof NavigationEnd))
            .subscribe( ()=> {
                this.breadCrumbItems = this.createBreadCrumbs(this.activatedRoute.root);
                if(this.nombreString != null){console.log("NOMBRE NULO");
                    this.breadCrumbItems.splice(-1);
                    this.breadCrumbItems.push({label: this.nombreString});
                }
            });
    /*BREADCRUMB*/

    this.carritoVacioObservable$ = this.store.pipe(select(selectSettingsCarritoEstaVacio));
    this.carritoVacioObservable$.subscribe( vacio => {
      this.carritoVacio = vacio
    });
  }

  checkAuthenticated(){
    if(window.sessionStorage.getItem('authenticated') == 'true'){
      this.logged$ = true;
    }
  }

  clearSearchinput(){
    this.textoBuscadorOvservable$ = this.store.pipe(select(selectSettingsBuscador)); 
    this.subscription.push(this.textoBuscadorOvservable$.subscribe( (texto) => {
      if(texto == null || texto == ''){
        this.inputSearch = null;
      }
    }))
  }

  getNombreBreadCrumb(){
    this.nombreProductoBreadcrumb$ = this.store.pipe(select(selectSettingsNombreBreadcrumb));
    if(this.nombreProductoBreadcrumb$ == null){
      this.nombreString = localStorage.getItem('nombreBreadcrumb');
    }
    if(this.language == "en"){
      this.nombreProductoBreadcrumb$ = this.store.pipe(select(selectSettingsNombreBreadcrumbEng));
      if(this.nombreProductoBreadcrumb$ == null){
        this.nombreString = localStorage.getItem('nombreBreadcrumbEng');
      }
    }
    if(this.nombreProductoBreadcrumb$ != null){
        this.nombreProductoBreadcrumb$.subscribe( (nombre) => {
            this.nombreString = nombre;
        })
    }
  }


  createBreadCrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: MenuItem[] = []): MenuItem[]{

    const children: ActivatedRoute[] = route.children;
    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }
/*           console.log("------------------------------------")*/
/*       console.log("RUTA: "+url) 
      console.log(" LABEL =>"+child.snapshot.data['breadcrumb']) */
      let label = child.snapshot.data['breadcrumb'];
      if(this.language == 'en'){
        label = child.snapshot.data['breadcrumbEng'];
      }
      if (!isNullOrUndefined(label)) {
        if(label == 'Productos'){
          url = 'products/all';
        }
        breadcrumbs.push({label, url});
      }
      return this.createBreadCrumbs(child, url, breadcrumbs);
    }

  }

  openShoppingCartDialog($event, overlayPanel: OverlayPanel){
    this.getProductosCesta();
    overlayPanel.toggle($event);
  }

  showCartMobileDialog() {
    this.getProductosCesta();
    this.displayCartMobile = true;
  }

  getProductosCesta() {
    this.cesta = this.productsService.getProductosCesta();
    if(this.cesta.productos.length == 0){
      this.carritoVacio = true;
    }else{
      this.carritoVacio = false;
    }
  }

  languages(){
    this.countries = [
      {label: 'Español', icon: 'spain.png', value:'es'},
      {label: 'English', icon: 'uk.png', value:'en'}
    ];
  }

  createMegaMenu(){
    this.megaMenuItems = [
        {
            label: this.nutricionLabel, icon: 'pi pi-fw pi-video',
            items: [
                [
                    {
                        label: this.proteinaLabel, 
                        items: [
                          {label: this.proteinaLabel, command: (event: any) => { this.irSeccionMenu('proteina','all')} }, 
                          {label: this.concentradoLabel, command: (event: any) => { this.irSeccionMenu('proteina','concentrado')} }, 
                          {label: this.aisladoLabel, command: (event: any) => { this.irSeccionMenu('proteina','aislado')}},
                          {label: this.hidrolizadoLabel, command: (event: any) => { this.irSeccionMenu('proteina','hidrolizado')}}, 
                          {label: this.proVegetalLabel, command: (event: any) => { this.irSeccionMenu('proteina','vegetal')}}]
                    },
                    {
                        label: 'Hidratos de Carbono',
                        items: [
                          {label: this.chLabel, command: (event: any) => { this.irSeccionMenu('hidratos','all')}},
                          {label: this.ganadorMasaLabel, command: (event: any) => { this.irSeccionMenu('hidratos','ganador')}}, 
                          {label: this.vitargoLabel, command: (event: any) => { this.irSeccionMenu('hidratos','vitargo')}}]
                    }
                ],
                [
                    {
                        label: 'Quemadores',
                        items: [
                          {label: this.quemadoresLabel, command: (event: any) => { this.irSeccionMenu('quemadores','all')}},
                          {label: this.termogenicosLabel, command: (event: any) => { this.irSeccionMenu('quemadores','termogenico')}}, 
                          {label: this.carnitinaLabel, command: (event: any) => { this.irSeccionMenu('quemadores','carnitina')}},
                          {label: this.diureticosLabel, command: (event: any) => { this.irSeccionMenu('quemadores','diuretico')}}, 
                          {label: this.claLabel, command: (event: any) => { this.irSeccionMenu('quemadores','cla')}}]
                    },
                    {
                        label: 'Energía',
                        items: [
                          {label: this.energiaLabel, command: (event: any) => { this.irSeccionMenu('energia','all')}},
                          {label: this.preOxidoLabel, command: (event: any) => { this.irSeccionMenu('energia','preentreno')}}, 
                          {label: this.cafeinaLabel, command: (event: any) => { this.irSeccionMenu('energia','cafeina')}}, 
                          {label: this.creatinaLabel, command: (event: any) => { this.irSeccionMenu('energia','creatina')}}]
                    }
                ]
            ]
        },
        {
            label: this.alimentacionLabel, icon: 'pi pi-fw pi-users',
            items: [
                [
                    {
                        label: 'Desayuno y Snacks',
                        items: [
                          {label: this.desayunoSnacksLabel, command: (event: any) => { this.irSeccionMenu('desayuno','all')}},
                          {label: this.tortitasProLabel, command: (event: any) => { this.irSeccionMenu('desayuno','tortitas')}}, 
                          {label: this.cremaLabel, command: (event: any) => { this.irSeccionMenu('desayuno','cremas')}}, 
                          {label: this.snacksSaladosLabel, command: (event: any) => { this.irSeccionMenu('desayuno','snack')}}]
                    },
                    {
                        label: 'Bebidas',
                        items: [
                          {label: this.bebidasLabel, command: (event: any) => { this.irSeccionMenu('bebidas','all')}},
                          {label: this.bebidasProLabel, command: (event: any) => { this.irSeccionMenu('bebidas','bebidaProteica')}}, 
                          {label: this.bebidasVegetalesLabel, command: (event: any) => { this.irSeccionMenu('bebidas','bebidaVegetal')}}, 
                          {label: this.infusionesLabel, command: (event: any) => { this.irSeccionMenu('bebidas','infusion')}}]
                    },
                ]
            ]
        },
        {
            label: this.promocionesLabel, icon: 'pi pi-fw pi-calendar',
            items: [
                [
                    {
                        label: 'Outlet',
                        items: [
                          {label: this.outletLabel, command: (event: any) => { this.irSeccionMenu('outlet','all')}},
                          {label: this.outletRopaLabel, command: (event: any) => { this.irSeccionMenu('outlet','outletRopa')}}, 
                          {label: this.outletNutricionLabel, command: (event: any) => { this.irSeccionMenu('outlet','outletNutricion')}}]
                    }
                ],
                [
                    {
                        label: 'Liquidación',
                        items: [
                          {label: this.liquidacionLabel, command: (event: any) => { this.irSeccionMenu('liquidacion','all')}},
                          {label: this.ultimasUnidadesLabel, command: (event: any) => { this.irSeccionMenu('liquidacion','ultimasUnidades')}}]
                    }
                ]
            ]
        }
    ]

/* MENU LATERAL MOVIL */

    this.panelMenuItems = [
      {
          label: this.nutricionLabel, icon: 'pi pi-fw pi-video',
          items: [
                  {
                      label: this.proteinaLabel, 
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('proteina','all')} }, 
                        {label: this.concentradoLabel, command: (event: any) => { this.irSeccionMenu('proteina','concentrado')} }, 
                        {label: this.aisladoLabel, command: (event: any) => { this.irSeccionMenu('proteina','aislado')}},
                        {label: this.hidrolizadoLabel, command: (event: any) => { this.irSeccionMenu('proteina','hidrolizado')}}, 
                        {label: this.proVegetalLabel, command: (event: any) => { this.irSeccionMenu('proteina','vegetal')}}]
                  },
                  {
                      label: this.chLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('hidratos','all')}},
                        {label: this.ganadorMasaLabel, command: (event: any) => { this.irSeccionMenu('hidratos','ganador')}}, 
                        {label: this.vitargoLabel, command: (event: any) => { this.irSeccionMenu('hidratos','vitargo')}}]
                  },
                  {
                      label: this.quemadoresLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('quemadores','all')}},
                        {label: this.termogenicosLabel, command: (event: any) => { this.irSeccionMenu('quemadores','termogenico')}}, 
                        {label: this.carnitinaLabel, command: (event: any) => { this.irSeccionMenu('quemadores','carnitina')}},
                        {label: this.diureticosLabel, command: (event: any) => { this.irSeccionMenu('quemadores','diuretico')}}, 
                        {label: this.claLabel, command: (event: any) => { this.irSeccionMenu('quemadores','cla')}}]
                  },
                  {
                      label: this.energiaLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('energia','all')}},
                        {label: this.preOxidoLabel, command: (event: any) => { this.irSeccionMenu('energia','preentreno')}}, 
                        {label: this.cafeinaLabel, command: (event: any) => { this.irSeccionMenu('energia','cafeina')}}, 
                        {label: this.creatinaLabel, command: (event: any) => { this.irSeccionMenu('energia','creatina')}}]
                  }
              ]
      },
      {
          label: this.alimentacionLabel, icon: 'pi pi-fw pi-users',
          items: [
                  {
                      label: this.desayunoSnacksLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('desayuno','all')}},
                        {label: this.tortitasProLabel, command: (event: any) => { this.irSeccionMenu('desayuno','tortitas')}}, 
                        {label: this.cremaLabel, command: (event: any) => { this.irSeccionMenu('desayuno','cremas')}}, 
                        {label: this.snacksSaladosLabel, command: (event: any) => { this.irSeccionMenu('desayuno','snack')}}]
                  },
                  {
                      label: this.bebidasLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('bebidas','all')}},
                        {label: this.bebidasProLabel, command: (event: any) => { this.irSeccionMenu('bebidas','bebidaProteica')}}, 
                        {label: this.bebidasVegetalesLabel, command: (event: any) => { this.irSeccionMenu('bebidas','bebidaVegetal')}}, 
                        {label: this.infusionesLabel, command: (event: any) => { this.irSeccionMenu('bebidas','infusion')}}]
                  },
              ]
      },
      {
          label: this.promocionesLabel, icon: 'pi pi-fw pi-calendar',
          items: [
                  {
                      label: this.outletLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('outlet','all')}},
                        {label: this.outletRopaLabel, command: (event: any) => { this.irSeccionMenu('outlet','outletRopa')}}, 
                        {label: this.outletNutricionLabel, command: (event: any) => { this.irSeccionMenu('outlet','outletNutricion')}}]
                  },
                  {
                      label: this.liquidacionLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('liquidacion','all')}},
                        {label: this.ultimasUnidadesLabel, command: (event: any) => { this.irSeccionMenu('liquidacion','ultimasUnidades')}}]
                  }
              ]
      }
  ]
  }

  irSeccionMenu(cat: string, subCat: string){
    this.router.navigate(['products', cat, subCat]);
    setTimeout(() => {
      this.reloadPage();  
    }, 500);
    
  }
   
  getLanguageBrowser(){
    let languageId: number = 0;
    this.language = this.productsService.getLanguageBrowser();
    if(this.language == 'es'){
      this.selectedLanguage = 'es';
      this.selectedLanguageMobile = this.countries[0];
      languageId = 0;
    }else{
      this.selectedLanguage = 'en';
      this.selectedLanguageMobile = this.countries[1];
      languageId = 1;
    }
  }

    ngOnDestroy(){
      this.subscription.forEach(s => s.unsubscribe());
    }




  private allLabel: string = "";
  private nutricionLabel: string = "";
  private proteinaLabel: string = "";
  private concentradoLabel: string = "";
  private aisladoLabel: string = "";
  private hidrolizadoLabel: string = "";
  private proVegetalLabel: string = "";
  private chLabel: string = "";
  private ganadorMasaLabel: string = "";
  private vitargoLabel: string = "";
  private quemadoresLabel: string = "";
  private termogenicosLabel: string = "";
  private carnitinaLabel: string = "";
  private diureticosLabel: string = "";
  private claLabel: string = "";
  private energiaLabel: string = "";
  private preOxidoLabel: string = "";
  private cafeinaLabel: string = "";
  private creatinaLabel: string = "";
  private alimentacionLabel: string = "";
  private desayunoSnacksLabel: string = "";
  private tortitasProLabel: string = "";
  private cremaLabel: string = "";
  private snacksSaladosLabel: string = "";
  private bebidasLabel: string = "";
  private bebidasProLabel: string = "";
  private bebidasVegetalesLabel: string = "";
  private infusionesLabel: string = "";
  private promocionesLabel: string = "";
  private outletLabel: string = "";
  private outletRopaLabel: string = "";
  private outletNutricionLabel: string = "";
  private liquidacionLabel: string = "";
  private ultimasUnidadesLabel: string = "";
  cargarLabelsMegaMenu(){
    this.translate.stream('todos').subscribe(data => {this.allLabel = data});
    this.translate.stream('navbar.nutricion').subscribe(data => {this.nutricionLabel = data});
    this.translate.stream('proteina').subscribe(data => {this.proteinaLabel = data}); 
    this.translate.stream('concentrado').subscribe(data => {this.concentradoLabel = data});
    this.translate.stream('aislado').subscribe(data => {this.aisladoLabel = data});
    this.translate.stream('hidrolizado').subscribe(data => {this.hidrolizadoLabel = data});
    this.translate.stream('proVegetal').subscribe(data => {this.proVegetalLabel = data});
    this.translate.stream('ch').subscribe(data => {this.chLabel = data});
    this.translate.stream('ganador').subscribe(data => {this.ganadorMasaLabel = data});
    this.translate.stream('vitargo').subscribe(data => {this.vitargoLabel = data});
    this.translate.stream('quemadores').subscribe(data => {this.quemadoresLabel = data});
    this.translate.stream('termogenicos').subscribe(data => {this.termogenicosLabel = data});
    this.translate.stream('carnitina').subscribe(data => {this.carnitinaLabel = data});
    this.translate.stream('diureticos').subscribe(data => {this.diureticosLabel = data});
    this.translate.stream('cla').subscribe(data => {this.claLabel = data});
    this.translate.stream('energia').subscribe(data => {this.energiaLabel = data});
    this.translate.stream('preOxido').subscribe(data => {this.preOxidoLabel = data});
    this.translate.stream('cafeina').subscribe(data => {this.cafeinaLabel = data});
    this.translate.stream('creatina').subscribe(data => {this.creatinaLabel = data});
    this.translate.stream('alimentacion').subscribe(data => {this.alimentacionLabel = data});
    this.translate.stream('barritasSnacks').subscribe(data => {this.desayunoSnacksLabel = data});
    this.translate.stream('tortitas').subscribe(data => {this.tortitasProLabel = data});
    this.translate.stream('cremas').subscribe(data => {this.cremaLabel = data});
    this.translate.stream('snacksSalados').subscribe(data => {this.snacksSaladosLabel = data});
    this.translate.stream('bebidas').subscribe(data => {this.bebidasLabel = data});
    this.translate.stream('bebidasPro').subscribe(data => {this.bebidasProLabel = data});
    this.translate.stream('bebidasVegetakes').subscribe(data => {this.bebidasVegetalesLabel = data});
    this.translate.stream('infusiones').subscribe(data => {this.infusionesLabel = data});
    this.translate.stream('promociones').subscribe(data => {this.promocionesLabel = data});
    this.translate.stream('outlet').subscribe(data => {this.outletLabel = data});
    this.translate.stream('outletRopa').subscribe(data => {this.outletRopaLabel = data});
    this.translate.stream('outletNutricion').subscribe(data => {this.outletNutricionLabel = data});
    this.translate.stream('liquidacion').subscribe(data => {this.liquidacionLabel = data});
    this.translate.stream('ultUnidades').subscribe(data => {this.ultimasUnidadesLabel = data});
  }


}
