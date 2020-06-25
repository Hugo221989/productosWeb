import { Component, OnDestroy, OnInit } from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService],
  animations: [myAnimation]
})
export class AppComponent implements OnInit, OnDestroy{
  language: string = "es";

  constructor(public dialogService: DialogService,
              private router:Router,
              private activatedRoute: ActivatedRoute,
              private store: Store<{settings: SettingsState}>,
              private tokenStorage: TokenStorageService,
              public productsService: ProductsService,
              public translate: TranslateService) {
                
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

  ngOnInit() {
    this.languages();

    this.getProductosCesta();

    this.getLanguageBrowser()

    this.cargarLabelsMegaMenu();

    this.checkAuthenticated();

    this.getNombreBreadCrumb();

    this.clearSearchinput();

    /*MEGA MENU*/
   /*  setTimeout(() => {
      this.createMegaMenu();
    }, 500); */
    /*BREADCRUMB*/ 
    this.manageBreadcrumb();

    this.checkCarritoVacio();
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
    //this.getProductosCesta();
    overlayPanel.toggle($event);
  }

  showCartMobileDialog() {
    //this.getProductosCesta();
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
                          {label: this.proteinaLabel, command: (event: any) => { this.irSeccionMenu('products','1','proteina','all')} }, 
                          {label: this.concentradoLabel, command: (event: any) => { this.irSeccionMenu('products','1','proteina','concentrado')} }, 
                          {label: this.aisladoLabel, command: (event: any) => { this.irSeccionMenu('products','1','proteina','aislado')}},
                          {label: this.hidrolizadoLabel, command: (event: any) => { this.irSeccionMenu('products','1','proteina','hidrolizado')}}, 
                          {label: this.proVegetalLabel, command: (event: any) => { this.irSeccionMenu('products','1','proteina','vegetal')}}]
                    },
                    {
                        label: 'Hidratos de Carbono',
                        items: [
                          {label: this.chLabel, command: (event: any) => { this.irSeccionMenu('products','1','hidratos','all')}},
                          {label: this.ganadorMasaLabel, command: (event: any) => { this.irSeccionMenu('products','1','hidratos','ganador')}}, 
                          {label: this.vitargoLabel, command: (event: any) => { this.irSeccionMenu('products','1','hidratos','vitargo')}}]
                    }
                ],
                [
                    {
                        label: 'Quemadores',
                        items: [
                          {label: this.quemadoresLabel, command: (event: any) => { this.irSeccionMenu('products','1','quemadores','all')}},
                          {label: this.termogenicosLabel, command: (event: any) => { this.irSeccionMenu('products','1','quemadores','termogenico')}}, 
                          {label: this.carnitinaLabel, command: (event: any) => { this.irSeccionMenu('products','1','quemadores','carnitina')}},
                          {label: this.diureticosLabel, command: (event: any) => { this.irSeccionMenu('products','1','quemadores','diuretico')}}, 
                          {label: this.claLabel, command: (event: any) => { this.irSeccionMenu('products','1','quemadores','cla')}}]
                    },
                    {
                        label: 'Energía',
                        items: [
                          {label: this.energiaLabel, command: (event: any) => { this.irSeccionMenu('products','1','energia','all')}},
                          {label: this.preOxidoLabel, command: (event: any) => { this.irSeccionMenu('products','1','energia','preentreno')}}, 
                          {label: this.cafeinaLabel, command: (event: any) => { this.irSeccionMenu('products','1','energia','cafeina')}}, 
                          {label: this.creatinaLabel, command: (event: any) => { this.irSeccionMenu('product','1','energia','creatina')}}]
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
                          {label: this.desayunoSnacksLabel, command: (event: any) => { this.irSeccionMenu('feeding','2','desayuno','all')}},
                          {label: this.tortitasProLabel, command: (event: any) => { this.irSeccionMenu('feeding','2','desayuno','tortitas')}}, 
                          {label: this.cremaLabel, command: (event: any) => { this.irSeccionMenu('feeding','2','desayuno','cremas')}}, 
                          {label: this.snacksSaladosLabel, command: (event: any) => { this.irSeccionMenu('feeding','2','desayuno','snack')}}]
                    },
                    {
                        label: 'Bebidas',
                        items: [
                          {label: this.bebidasLabel, command: (event: any) => { this.irSeccionMenu('feeding','2','bebidas','all')}},
                          {label: this.bebidasProLabel, command: (event: any) => { this.irSeccionMenu('feeding','2','bebidas','bebidaProteica')}}, 
                          {label: this.bebidasVegetalesLabel, command: (event: any) => { this.irSeccionMenu('feeding','2','bebidas','bebidaVegetal')}}, 
                          {label: this.infusionesLabel, command: (event: any) => { this.irSeccionMenu('feeding','2','bebidas','infusion')}}]
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
                          {label: this.outletLabel, command: (event: any) => { this.irSeccionMenu('promotions','3','outlet','all')}},
                          {label: this.outletRopaLabel, command: (event: any) => { this.irSeccionMenu('promotions','3','outlet','outletRopa')}}, 
                          {label: this.outletNutricionLabel, command: (event: any) => { this.irSeccionMenu('promotions','3','outlet','outletNutricion')}}]
                    }
                ],
                [
                    {
                        label: 'Liquidación',
                        items: [
                          {label: this.liquidacionLabel, command: (event: any) => { this.irSeccionMenu('promotions','3','liquidacion','all')}},
                          {label: this.ultimasUnidadesLabel, command: (event: any) => { this.irSeccionMenu('promotions','3','liquidacion','ultimasUnidades')}}]
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
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('product','1','proteina','all')} }, 
                        {label: this.concentradoLabel, command: (event: any) => { this.irSeccionMenu('product','1','proteina','concentrado')} }, 
                        {label: this.aisladoLabel, command: (event: any) => { this.irSeccionMenu('product','1','proteina','aislado')}},
                        {label: this.hidrolizadoLabel, command: (event: any) => { this.irSeccionMenu('product','1','proteina','hidrolizado')}}, 
                        {label: this.proVegetalLabel, command: (event: any) => { this.irSeccionMenu('product','1','proteina','vegetal')}}]
                  },
                  {
                      label: this.chLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('product','1','hidratos','all')}},
                        {label: this.ganadorMasaLabel, command: (event: any) => { this.irSeccionMenu('product','1','hidratos','ganador')}}, 
                        {label: this.vitargoLabel, command: (event: any) => { this.irSeccionMenu('product','1','hidratos','vitargo')}}]
                  },
                  {
                      label: this.quemadoresLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('product','1','quemadores','all')}},
                        {label: this.termogenicosLabel, command: (event: any) => { this.irSeccionMenu('product','1','quemadores','termogenico')}}, 
                        {label: this.carnitinaLabel, command: (event: any) => { this.irSeccionMenu('product','1','quemadores','carnitina')}},
                        {label: this.diureticosLabel, command: (event: any) => { this.irSeccionMenu('product','1','quemadores','diuretico')}}, 
                        {label: this.claLabel, command: (event: any) => { this.irSeccionMenu('product','1','quemadores','cla')}}]
                  },
                  {
                      label: this.energiaLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('product','1','energia','all')}},
                        {label: this.preOxidoLabel, command: (event: any) => { this.irSeccionMenu('product','1','energia','preentreno')}}, 
                        {label: this.cafeinaLabel, command: (event: any) => { this.irSeccionMenu('product','1','energia','cafeina')}}, 
                        {label: this.creatinaLabel, command: (event: any) => { this.irSeccionMenu('product','1','energia','creatina')}}]
                  }
              ]
      },
      {
          label: this.alimentacionLabel, icon: 'pi pi-fw pi-users',
          items: [
                  {
                      label: this.desayunoSnacksLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('feeding','2','desayuno','all')}},
                        {label: this.tortitasProLabel, command: (event: any) => { this.irSeccionMenu('feeding','2','desayuno','tortitas')}}, 
                        {label: this.cremaLabel, command: (event: any) => { this.irSeccionMenu('feeding','2','desayuno','cremas')}}, 
                        {label: this.snacksSaladosLabel, command: (event: any) => { this.irSeccionMenu('feeding','2','desayuno','snack')}}]
                  },
                  {
                      label: this.bebidasLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('feeding','2','bebidas','all')}},
                        {label: this.bebidasProLabel, command: (event: any) => { this.irSeccionMenu('feeding','2','bebidas','bebidaProteica')}}, 
                        {label: this.bebidasVegetalesLabel, command: (event: any) => { this.irSeccionMenu('feeding','2','bebidas','bebidaVegetal')}}, 
                        {label: this.infusionesLabel, command: (event: any) => { this.irSeccionMenu('feeding','2','bebidas','infusion')}}]
                  },
              ]
      },
      {
          label: this.promocionesLabel, icon: 'pi pi-fw pi-calendar',
          items: [
                  {
                      label: this.outletLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('promotions','3','outlet','all')}},
                        {label: this.outletRopaLabel, command: (event: any) => { this.irSeccionMenu('promotions','3','outlet','outletRopa')}}, 
                        {label: this.outletNutricionLabel, command: (event: any) => { this.irSeccionMenu('promotions','3','outlet','outletNutricion')}}]
                  },
                  {
                      label: this.liquidacionLabel,
                      items: [
                        {label: this.allLabel, command: (event: any) => { this.irSeccionMenu('promotions','3','liquidacion','all')}},
                        {label: this.ultimasUnidadesLabel, command: (event: any) => { this.irSeccionMenu('promotions','3','liquidacion','ultimasUnidades')}}]
                  }
              ]
      }
  ]
  }

  irSeccionMenu(moduloPadre: string, catPadreUrl:string, cat: string, subCat: string){
    this.router.navigate([moduloPadre, catPadreUrl, cat, subCat]);
   /*  setTimeout(() => {
      this.reloadPage();  
    }, 500); */
    
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
