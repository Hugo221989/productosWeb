import { Component, OnDestroy, OnInit, AfterViewChecked } from '@angular/core';
import {DialogService, DynamicDialogRef, DynamicDialogConfig} from 'primeng/dynamicdialog';
import { MenuItem, SelectItem} from 'primeng/api';
import {MegaMenuItem} from 'primeng/api/megamenuitem';
import { LoginComponent } from './pages/login/login-component/login.component';
import { faPhoneVolume, faShoppingCart, faInfoCircle, faTruck} from '@fortawesome/free-solid-svg-icons';
import { Router, NavigationEnd, ActivatedRoute, RouterOutlet } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { filter } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { SettingsState } from './settings/settings.model';
import { selectSettingsNombreBreadcrumb, selectSettingsCarritoEstaVacio, selectSettingsBuscador, selectSettingsNombreBreadcrumbEng, selectSettingsCesta } from './settings/settings.selectors';
import { RegisterComponent } from './pages/register/register-component/register.component';
import { actionSettingsIsAuthenticated, actionSettingsBuscador, actionSettingsCarritoVacio, actionSettingsCesta } from './settings/settings.actions';
import { TokenStorageService } from './pages/login/logn-service/token-storage.service';
import { OverlayPanel } from 'primeng/overlaypanel/public_api';
import { Cesta, ProductoCesta } from './models/cesta';
import { ProductsService } from './pages/products-page/service/products.service';
import { TranslateService } from '@ngx-translate/core';
import { myAnimation } from './animations/animation';
import { LoginService } from './pages/login/logn-service/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService],
  animations: [myAnimation]
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked{
  language: string = "es";
  mostrarFooter: boolean = false;

  constructor(public dialogService: DialogService,
              private router:Router,
              private activatedRoute: ActivatedRoute,
              private store: Store<{settings: SettingsState}>,
              private tokenStorage: TokenStorageService,
              public productsService: ProductsService,
              public translate: TranslateService,
              private loginService: LoginService,
              public ref: DynamicDialogRef) {
                this.mostrarFooter = false;
              }

  faPhoneVolume = faPhoneVolume;
  faShoppingCart = faShoppingCart;
  faInfoCircle = faInfoCircle;
  faTruck = faTruck;
  title = 'productosWeb';
  megaMenuItems: MegaMenuItem[];
  panelMenuItems: MenuItem[];
  breadCrumbItems: MenuItem[];
  displayCartMobile: boolean;
  carritoVacioObservable$: Observable<boolean>;
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
  public displayModalRegistrationEmailSended: boolean = false;
  private isMobile = false;

  ngOnInit() {
    this.languages();
    this.getProductosCesta();
    this.getLanguageBrowser()
    this.cargarLabelsMegaMenu();
    this.checkAuthenticated();
    this.getNombreBreadCrumb();
    this.clearSearchinput();
    this.manageBreadcrumb();
    this.checkCarritoVacio();
    this.isRegistrationEmailSended();
    this.isLoginModalSwitched();
  }

  ngAfterViewChecked(){
    setTimeout(() => {
      this.mostrarFooter = true;  
    }, 4000);
  }

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

  showLoginModal(device: string) {
    let width:string = "40%";
    if(device == "mobile"){
      width = "90%";
      this.isMobile = true;
    }
      this.ref = this.dialogService.open(LoginComponent, {
        header: 'Iniciar Sesión',
        width: width,
        dismissableMask: true,
        closeOnEscape: true,
        baseZIndex: 1010
    });
  }

  showRegisterModal(device: string) {
    let width:string = "40%";
    if(device == "mobile"){
      width = "90%";
      this.isMobile = true;
    }
    this.ref = this.dialogService.open(RegisterComponent, {
        header: 'Registrarse',
        width: width,
        dismissableMask: true,
        autoZIndex: true,
        closeOnEscape: true,
        baseZIndex: 1010
    });
  }

  isRegistrationEmailSended(){
    this.subscription.push( this.loginService.isRegistrationEmailSended().subscribe(data => {
      if(data == true){
        this.closeRegisterModal();
        setTimeout(() => {
          this.showRegistrationEmailSendedModal();
        }, 500);
        
      }
    }))
  }

  isLoginModalSwitched(){
    this.subscription.push( this.loginService.isLoginSwitchedToRegistrationModal().subscribe(data => {
      if(data == true){
        this.closeLoginModal();
        setTimeout(() => {
          this.showRegisterModalFromLoginModal();  
        }, 500);
        
      }
    }))
  }

  closeRegisterModal(){
    this.ref.close();
  }
  showRegistrationEmailSendedModal(){
    this.displayModalRegistrationEmailSended = true;console.log("displayModalRegistrationEmailSended: ",this.displayModalRegistrationEmailSended);
  }

  showRegisterModalFromLoginModal(){
    if(this.isMobile){
      this.showRegisterModal('mobile');
    }else{
      this.showRegisterModal('desktop');
    }
  }
  closeLoginModal(){
    this.ref.close();
  }

  miCuenta(){
    this.router.navigate(['/account/']);
  }
  ayuda(){
    this.router.navigate(['/home/']);
  }

  cerrarSesion(){
    this.productsService.saveUserCartBbdd();
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

  manageBreadcrumb(){
    this.router.events.pipe(
      filter(
          event => event instanceof NavigationEnd))
          .subscribe( ()=> {
              this.breadCrumbItems = this.createBreadCrumbs(this.activatedRoute.root);
              if(this.nombreString != null){
                  this.breadCrumbItems.splice(-1);
                  this.breadCrumbItems.push({label: this.nombreString});
              }
          });
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
      this.subscription.push(this.nombreProductoBreadcrumb$.subscribe( (nombre) => {
            this.nombreString = nombre;
        }));
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

  checkCarritoVacio(){
    this.carritoVacioObservable$ = this.store.pipe(select(selectSettingsCarritoEstaVacio));
    this.subscription.push(this.carritoVacioObservable$.subscribe());
  }

  openShoppingCartDialog($event, overlayPanel: OverlayPanel){
    overlayPanel.toggle($event);
  }

  showCartMobileDialog() {
    this.displayCartMobile = true;
  }

  getProductosCesta() {
    let productsCesta = [];
      this.cesta = {
        productosCesta: productsCesta
      }
      this.subscription.push(this.store.pipe(select(selectSettingsCesta)).subscribe(data =>{
        if(data){
          this.cesta = data;
          if(this.cesta.productosCesta.length == 0){
            this.store.dispatch(actionSettingsCarritoVacio({
              carritoEstaVacio: true
            }))
          }else{
            this.store.dispatch(actionSettingsCarritoVacio({
              carritoEstaVacio: false
            }))
          }
        }else{
          if(sessionStorage.getItem('cesta')){
            this.cesta =  JSON.parse(sessionStorage.getItem('cesta'));
          }else{
            let proCesta: ProductoCesta[] = [];
            this.cesta = {
              productosCesta: proCesta
            }
          } 
          this.store.dispatch(actionSettingsCesta({
            cesta: this.cesta
          }))
        }
      })
      )
  }

  languages(){
    this.countries = [
      {label: 'Español', icon: 'spain.png', value:'es'},
      {label: 'English', icon: 'uk.png', value:'en'}
    ];
  }
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
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
                          {label: this.proteinaLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','proteina','all')} }, 
                          {label: this.concentradoLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','proteina','concentrado')} }, 
                          {label: this.aisladoLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','proteina','aislado')}},
                          {label: this.hidrolizadoLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','proteina','hidrolizado')}}, 
                          {label: this.proVegetalLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','proteina','vegetal')}}]
                    },
                    {
                        label: 'Hidratos de Carbono',
                        items: [
                          {label: this.chLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','hidratos','all')}},
                          {label: this.ganadorMasaLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','hidratos','ganador')}}, 
                          {label: this.vitargoLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','hidratos','vitargo')}}]
                    }
                ],
                [
                    {
                        label: 'Quemadores',
                        items: [
                          {label: this.quemadoresLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','quemadores','all')}},
                          {label: this.termogenicosLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','quemadores','termogenico')}}, 
                          {label: this.carnitinaLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','quemadores','carnitina')}},
                          {label: this.diureticosLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','quemadores','diuretico')}}, 
                          {label: this.claLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','quemadores','cla')}}]
                    },
                    {
                        label: 'Energía',
                        items: [
                          {label: this.energiaLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','energia','all')}},
                          {label: this.preOxidoLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','energia','preentreno')}}, 
                          {label: this.cafeinaLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','energia','cafeina')}}, 
                          {label: this.creatinaLabel, command: (event: any) => { this.irSeccionMenu('product','nutricion','energia','creatina')}}]
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
                          {label: this.desayunoSnacksLabel, command: (event: any) => { this.irSeccionMenu('feeding','alimentacion','desayuno','all')}},
                          {label: this.tortitasProLabel, command: (event: any) => { this.irSeccionMenu('feeding','alimentacion','desayuno','tortitas')}}, 
                          {label: this.cremaLabel, command: (event: any) => { this.irSeccionMenu('feeding','alimentacion','desayuno','cremas')}}, 
                          {label: this.snacksSaladosLabel, command: (event: any) => { this.irSeccionMenu('feeding','alimentacion','desayuno','snack')}}]
                    },
                    {
                        label: 'Bebidas',
                        items: [
                          {label: this.bebidasLabel, command: (event: any) => { this.irSeccionMenu('feeding','alimentacion','bebidas','all')}},
                          {label: this.bebidasProLabel, command: (event: any) => { this.irSeccionMenu('feeding','alimentacion','bebidas','bebidaProteica')}}, 
                          {label: this.bebidasVegetalesLabel, command: (event: any) => { this.irSeccionMenu('feeding','alimentacion','bebidas','bebidaVegetal')}}, 
                          {label: this.infusionesLabel, command: (event: any) => { this.irSeccionMenu('feeding','alimentacion','bebidas','infusion')}}]
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
                          {label: this.outletLabel, command: (event: any) => { this.irSeccionMenu('promotions','promociones','outlet','all')}},
                          {label: this.outletRopaLabel, command: (event: any) => { this.irSeccionMenu('promotions','promociones','outlet','outletRopa')}}, 
                          {label: this.outletNutricionLabel, command: (event: any) => { this.irSeccionMenu('promotions','promociones','outlet','outletNutricion')}}]
                    }
                ],
                [
                    {
                        label: 'Liquidación',
                        items: [
                          {label: this.liquidacionLabel, command: (event: any) => { this.irSeccionMenu('promotions','promociones','liquidacion','all')}},
                          {label: this.ultimasUnidadesLabel, command: (event: any) => { this.irSeccionMenu('promotions','promociones','liquidacion','ultimasUnidades')}}]
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
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','proteina','all')} }, 
                        {label: this.concentradoLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','proteina','concentrado')} }, 
                        {label: this.aisladoLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','proteina','aislado')}},
                        {label: this.hidrolizadoLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','proteina','hidrolizado')}}, 
                        {label: this.proVegetalLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','proteina','vegetal')}}]
                  },
                  {
                      label: this.chLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','hidratos','all')}},
                        {label: this.ganadorMasaLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','hidratos','ganador')}}, 
                        {label: this.vitargoLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','hidratos','vitargo')}}]
                  },
                  {
                      label: this.quemadoresLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','quemadores','all')}},
                        {label: this.termogenicosLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','quemadores','termogenico')}}, 
                        {label: this.carnitinaLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','quemadores','carnitina')}},
                        {label: this.diureticosLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','quemadores','diuretico')}}, 
                        {label: this.claLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','quemadores','cla')}}]
                  },
                  {
                      label: this.energiaLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','energia','all')}},
                        {label: this.preOxidoLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','energia','preentreno')}}, 
                        {label: this.cafeinaLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','energia','cafeina')}}, 
                        {label: this.creatinaLabel, command: (event: any) => { this.irSeccionMenu('products','nutricion','energia','creatina')}}]
                  }
              ]
      },
      {
          label: this.alimentacionLabel, icon: 'pi pi-fw pi-users',
          items: [
                  {
                      label: this.desayunoSnacksLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('feeding','alimentacion','desayuno','all')}},
                        {label: this.tortitasProLabel, command: (event: any) => { this.irSeccionMenu('feeding','alimentacion','desayuno','tortitas')}}, 
                        {label: this.cremaLabel, command: (event: any) => { this.irSeccionMenu('feeding','alimentacion','desayuno','cremas')}}, 
                        {label: this.snacksSaladosLabel, command: (event: any) => { this.irSeccionMenu('feeding','alimentacion','desayuno','snack')}}]
                  },
                  {
                      label: this.bebidasLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('feeding','alimentacion','bebidas','all')}},
                        {label: this.bebidasProLabel, command: (event: any) => { this.irSeccionMenu('feeding','alimentacion','bebidas','bebidaProteica')}}, 
                        {label: this.bebidasVegetalesLabel, command: (event: any) => { this.irSeccionMenu('feeding','alimentacion','bebidas','bebidaVegetal')}}, 
                        {label: this.infusionesLabel, command: (event: any) => { this.irSeccionMenu('feeding','alimentacion','bebidas','infusion')}}]
                  },
              ]
      },
      {
          label: this.promocionesLabel, icon: 'pi pi-fw pi-calendar',
          items: [
                  {
                      label: this.outletLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('promotions','promociones','outlet','all')}},
                        {label: this.outletRopaLabel, command: (event: any) => { this.irSeccionMenu('promotions','promociones','outlet','outletRopa')}}, 
                        {label: this.outletNutricionLabel, command: (event: any) => { this.irSeccionMenu('promotions','promociones','outlet','outletNutricion')}}]
                  },
                  {
                      label: this.liquidacionLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('promotions','promociones','liquidacion','all')}},
                        {label: this.ultimasUnidadesLabel, command: (event: any) => { this.irSeccionMenu('promotions','promociones','liquidacion','ultimasUnidades')}}]
                  }
              ]
      }
  ]
  }

  irSeccionMenu(moduloPadre: string, catPadreUrl:string, cat: string, subCat: string){
    this.router.navigate([moduloPadre, catPadreUrl, cat, subCat]);
    this.visibleSidebar1 = false;
  }
   
  getLanguageBrowser(){
    this.language = this.productsService.getLanguageBrowser();
    if(this.language == 'es'){
      this.selectedLanguage = 'es';
      this.selectedLanguageMobile = this.countries[0];
    }else{
      this.selectedLanguage = 'en';
      this.selectedLanguageMobile = this.countries[1];
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
    this.subscription.push(this.translate.getTranslation(this.selectedLanguage).subscribe(data=>{
      this.allLabel = data.todos;
      this.nutricionLabel = data['navbar.nutricion'];
      this.proteinaLabel = data.proteina;
      this.concentradoLabel = data.concentrado;
      this.aisladoLabel = data.aislado;
      this.hidrolizadoLabel = data.hidrolizado;
      this.proVegetalLabel = data.proVegetal;
      this.chLabel = data.ch;
      this.ganadorMasaLabel = data.ganador;
      this.vitargoLabel = data.vitargo;
      this.quemadoresLabel = data.quemadores;
      this.termogenicosLabel = data.termogenicos;
      this.carnitinaLabel = data.carnitina;
      this.diureticosLabel = data.diureticos;
      this.claLabel = data.cla;
      this.energiaLabel = data.energia;
      this.preOxidoLabel = data.preOxido;
      this.cafeinaLabel = data.cafeina;
      this.creatinaLabel = data.creatina;
      this.alimentacionLabel = data.alimentacion;
      this.desayunoSnacksLabel = data.barritasSnacks;
      this.tortitasProLabel = data.tortitas;
      this.cremaLabel = data.cremas;
      this.snacksSaladosLabel = data.snacksSalados;
      this.bebidasLabel = data.bebidas;
      this.bebidasProLabel = data.bebidasPro;
      this.bebidasVegetalesLabel = data.bebidasVegetakes;
      this.infusionesLabel = data.infusiones;
      this.promocionesLabel = data.promociones;
      this.outletLabel = data.outlet;
      this.outletRopaLabel = data.outletRopa;
      this.outletNutricionLabel = data.outletNutricion;
      this.liquidacionLabel = data.liquidacion;
      this.ultimasUnidadesLabel = data.ultUnidades;
      this.createMegaMenu();
    }))
  }


}
