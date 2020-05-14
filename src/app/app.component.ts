import { Component } from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
import {MenuItem} from 'primeng/api';
import { LoginComponent } from './pages/login/login-component/login.component';
import { faPhoneVolume, faShoppingCart, faInfoCircle, faTruck} from '@fortawesome/free-solid-svg-icons';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { SettingsState } from './settings/settings.model';
import { selectSettingsNombreBreadcrumb, selectSettingsCarritoEstaVacio, selectSettingsBuscador } from './settings/settings.selectors';
import { RegisterComponent } from './pages/register/register-component/register.component';
import { actionSettingsIsAuthenticated, actionSettingsBuscador } from './settings/settings.actions';
import { TokenStorageService } from './pages/login/logn-service/token-storage.service';
import { OverlayPanel } from 'primeng/overlaypanel/public_api';
import { Cesta } from './models/cesta';
import { ProductsService } from './pages/products-page/service/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService]
})
export class AppComponent {

  constructor(public dialogService: DialogService,
              private router:Router,
              private activatedRoute: ActivatedRoute,
              private store: Store<{settings: SettingsState}>,
              private tokenStorage: TokenStorageService,
              private productsService: ProductsService) {}

  faPhoneVolume = faPhoneVolume;
  faShoppingCart = faShoppingCart;
  faInfoCircle = faInfoCircle;
  faTruck = faTruck;
  title = 'productosWeb';
  megaMenuItems: MenuItem[];
  breadCrumbItems: MenuItem[];
  carritoVacio: boolean = false;
  carritoVacioObservable$: Observable<boolean>;
  refDialog;
  isAuthenticated$: Observable<boolean>;
  logged$:boolean = false;
  nombreProductoBreadcrumb$: Observable<string>;
  nombreString = null;

  cesta: Cesta;

  textoBuscadorOvservable$: Observable<string>;
  inputSearch: string = '';

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

    this.checkAuthenticated();

    this.getNombreBreadCrumb();

    this.clearSearchinput();

  /*MEGA MENU*/
    this.createMegaMenu();
    /*MEGA MENU*/

    /*BREADCRUMB*/
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
    this.textoBuscadorOvservable$.subscribe( (texto) => {
      if(texto == null || texto == ''){console.log("LIMPIAR INPUT")
        this.inputSearch = null;
      }
    })
  }

  getNombreBreadCrumb(){
    this.nombreProductoBreadcrumb$ = this.store.pipe(select(selectSettingsNombreBreadcrumb));
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
/*           console.log("------------------------------------")
      console.log("RUTA: "+url)
      console.log(" LABEL =>"+child.snapshot.data['breadcrumb']) */
      const label = child.snapshot.data['breadcrumb'];
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
    this.cesta = this.productsService.getProductosCesta();
    if(this.cesta.productos.length == 0){
      this.carritoVacio = true;
    }else{
      this.carritoVacio = false;
    }
    overlayPanel.toggle($event);
  }

  createMegaMenu(){
    this.megaMenuItems = [
        {
            label: 'Nutrición', icon: 'pi pi-fw pi-video',
            items: [
                [
                    {
                        label: 'Proteína', 
                        items: [
                          {label: 'Proteína', style: "{'color':'red'}", command: (event: any) => { this.irSeccionMenu('proteina','all')} }, 
                          {label: 'Concentrado de Suero', command: (event: any) => { this.irSeccionMenu('proteina','concentrado')} }, 
                          {label: 'Aislado de Proteína Whey', command: (event: any) => { this.irSeccionMenu('proteina','aislado')}},
                          {label: 'Hidrolizado de proteína Whey', command: (event: any) => { this.irSeccionMenu('proteina','hidrolizado')}}, 
                          {label: 'Proteína Vegetal', command: (event: any) => { this.irSeccionMenu('proteina','vegetal')}}]
                    },
                    {
                        label: 'Hidratos de Carbono',
                        items: [
                          {label: 'Hidratos de Carbono', command: (event: any) => { this.irSeccionMenu('hidratos','all')}},
                          {label: 'Ganador de Masa', command: (event: any) => { this.irSeccionMenu('hidratos','ganador')}}, 
                          {label: 'Vitargo', command: (event: any) => { this.irSeccionMenu('hidratos','vitargo')}}]
                    }
                ],
                [
                    {
                        label: 'Quemadores',
                        items: [
                          {label: 'Quemadores', command: (event: any) => { this.irSeccionMenu('quemadores','all')}},
                          {label: 'Termogénicos', command: (event: any) => { this.irSeccionMenu('quemadores','termogenico')}}, 
                          {label: 'L-Carnitina', command: (event: any) => { this.irSeccionMenu('quemadores','carnitina')}},
                          {label: 'Diuréticos', command: (event: any) => { this.irSeccionMenu('quemadores','diuretico')}}, 
                          {label: 'CLA', command: (event: any) => { this.irSeccionMenu('quemadores','cla')}}]
                    },
                    {
                        label: 'Energía',
                        items: [
                          {label: 'Energía', command: (event: any) => { this.irSeccionMenu('energia','all')}},
                          {label: 'Preentrenamiento y Óxido Nítrico', command: (event: any) => { this.irSeccionMenu('energia','preentreno')}}, 
                          {label: 'Cafeína', command: (event: any) => { this.irSeccionMenu('energia','cafeina')}}, 
                          {label: 'Creatina', command: (event: any) => { this.irSeccionMenu('energia','creatina')}}]
                    }
                ]
            ]
        },
        {
            label: 'Alimentación', icon: 'pi pi-fw pi-users',
            items: [
                [
                    {
                        label: 'Barritas y Snacks',
                        items: [
                          {label: 'Barritas y Snacks', command: (event: any) => { this.irSeccionMenu('barritas','all')}},
                          {label: 'Barritas Protéicas', command: (event: any) => { this.irSeccionMenu('barritas','barritaProteica')}}, 
                          {label: 'Galletas', command: (event: any) => { this.irSeccionMenu('barritas','galleta')}}, 
                          {label: 'Snacks Salados', command: (event: any) => { this.irSeccionMenu('barritas','snack')}}]
                    },
                    {
                        label: 'Bebidas',
                        items: [
                          {label: 'Bebidas', command: (event: any) => { this.irSeccionMenu('bebidas','all')}},
                          {label: 'Bebidas Protéicas', command: (event: any) => { this.irSeccionMenu('bebidas','bebidaProteica')}}, 
                          {label: 'Bebidas Vegetales', command: (event: any) => { this.irSeccionMenu('bebidas','bebidaVegetal')}}, 
                          {label: 'Infusiones', command: (event: any) => { this.irSeccionMenu('bebidas','infusion')}}]
                    },
                ]
            ]
        },
        {
            label: 'Promociones', icon: 'pi pi-fw pi-calendar',
            items: [
                [
                    {
                        label: 'Outlet',
                        items: [
                          {label: 'Outlet', command: (event: any) => { this.irSeccionMenu('outlet','all')}},
                          {label: 'Outlet Ropa', command: (event: any) => { this.irSeccionMenu('outlet','outletRopa')}}, 
                          {label: 'Outlet Nutrición', command: (event: any) => { this.irSeccionMenu('outlet','outletNutricion')}}]
                    }
                ],
                [
                    {
                        label: 'Liquidación',
                        items: [
                          {label: 'Liquidación', command: (event: any) => { this.irSeccionMenu('liquidacion','all')}},
                          {label: 'Últimas Unidades', command: (event: any) => { this.irSeccionMenu('liquidacion','ultimasUnidades')}}]
                    }
                ]
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
      

}
