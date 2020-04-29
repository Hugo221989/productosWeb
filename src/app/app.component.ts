import { Component, ViewChild, TemplateRef } from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
import {Message, MenuItem} from 'primeng/api';
import { LoginComponent } from './pages/login/login-component/login.component';
import { faPhoneVolume, faShoppingCart, faInfoCircle, faTruck} from '@fortawesome/free-solid-svg-icons';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ShoopingCartComponent } from './pages/account/shopping-cart/shooping-cart.component';
import { isNullOrUndefined } from 'util';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { SettingsState } from './settings/settings.model';
import { selectSettingsHayBreadcrumb, selectSettingsNombreBreadcrumb } from './settings/settings.selectors';

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
              private store: Store<{settings: SettingsState}>) {}

  faPhoneVolume = faPhoneVolume;
  faShoppingCart = faShoppingCart;
  faInfoCircle = faInfoCircle;
  faTruck = faTruck;
  title = 'productosWeb';
  megaMenuItems: MenuItem[];
  breadCrumbItems: MenuItem[];
  carritoVacio: boolean = false;

  autocompleteText: string;
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

    show() {
      const ref = this.dialogService.open(LoginComponent, {
          header: 'Iniciar Sesión',
          width: '40%'
      });
  }
  miCuenta(){
    this.router.navigate(['/account/']);
  }

hayBreadcrumnFinal$: Observable<boolean>;
nombreProductoBreadcrumb$: Observable<string>;
nombreString = null;
    ngOnInit() {

       /*  this.hayBreadcrumnFinal$ = this.store.pipe(select(selectSettingsHayBreadcrumb)); */
        this.nombreProductoBreadcrumb$ = this.store.pipe(select(selectSettingsNombreBreadcrumb));
        if(this.nombreProductoBreadcrumb$ != null){
            this.nombreProductoBreadcrumb$.subscribe( (nombre) => {
                this.nombreString = nombre;
            })
            
        }

      /*MEGA MENU*/
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
            breadcrumbs.push({label, url});console.log("BREADCRUMB: ",label)
          }
          return this.createBreadCrumbs(child, url, breadcrumbs);
        }

      }

}
