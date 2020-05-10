import { Component } from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
import {Message, MenuItem} from 'primeng/api';
import { LoginComponent } from './pages/login/login-component/login.component';
import { faPhoneVolume, faShoppingCart, faInfoCircle, faTruck} from '@fortawesome/free-solid-svg-icons';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { SettingsState } from './settings/settings.model';
import { selectSettingsNombreBreadcrumb, selectSettingsCarritoEstaVacio } from './settings/settings.selectors';
import { RegisterComponent } from './pages/register/register-component/register.component';
import { actionSettingsIsAuthenticated } from './settings/settings.actions';
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
  /* hayBreadcrumnFinal$: Observable<boolean>; */
  nombreProductoBreadcrumb$: Observable<string>;
  nombreString = null;

  autocompleteText: string;
  cesta: Cesta;
  /* @ViewChild('shoppingCart')
  private shoppingCart: ShoopingCartComponent;
 */
    results: string[];
    resultados: string[] = [
      "Albania", "Argentina", "España", "Suecia", "Francia", "Estonia"
    ];
    position: string;
    msgs: Message[] = [];

    search(event) {
      this.results = this.resultados;
        /* this.mylookupservice.getResults(event.query).then(data => {
            this.results = data;
        }); */
    }

    showLoginModal() {
     /*    if(this.refDialog){
            this.refDialog.close();
        } */
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

  logged$:boolean = false;
    ngOnInit() {

        if(window.sessionStorage.getItem('authenticated') == 'true'){
            this.logged$ = true;
        }

        this.nombreProductoBreadcrumb$ = this.store.pipe(select(selectSettingsNombreBreadcrumb));
        if(this.nombreProductoBreadcrumb$ != null){
            this.nombreProductoBreadcrumb$.subscribe( (nombre) => {
                this.nombreString = nombre;
            })
            
        }

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
        this.carritoVacioObservable$.subscribe( vacio => {console.log("SUBSCRIPCION CARRITO")
          this.carritoVacio = vacio
        });
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
                            items: [{label: 'Concentrado de Suero'}, {label: 'Aislado de Proteína Whey'},{label: 'Hidrolizado de proteína Whey'}, {label: 'Proteína Vegetal'}]
                        },
                        {
                            label: 'Hidratos de Carbono',
                            items: [{label: 'Ganador de Masa'}, {label: 'Vitargo'}]
                        }
                    ],
                    [
                        {
                            label: 'Quemadores',
                            items: [{label: 'Termogénicos'}, {label: 'L-Carnitina'},{label: 'Diuréticos'}, {label: 'CLA'}]
                        },
                        {
                            label: 'Energía',
                            items: [{label: 'Preentrenamiento y Óxido Nítrico'}, {label: 'Cafeína'}, {label: 'Creatina'}]
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
                            items: [{label: 'Barritas Protéicas'}, {label: 'Galletas'}, {label: 'Snacks Salados'}]
                        },
                        {
                            label: 'Bebidas',
                            items: [{label: 'Bebidas Protéicas'}, {label: 'Bebidas Vegetales'}, {label: 'Infusiones'}]
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
                            items: [{label: 'Outlet Ropa'}, {label: 'Outlet Nutrición'}]
                        }
                    ],
                    [
                        {
                            label: 'Liquidación',
                            items: [{label: 'Últimas Unidades'}]
                        }
                    ]
                ]
            }
        ]
      }
      

}
