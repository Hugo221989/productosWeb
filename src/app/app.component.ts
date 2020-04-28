import { Component, ViewChild, TemplateRef } from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
import {Message, MenuItem} from 'primeng/api';
import { LoginComponent } from './pages/login/login-component/login.component';
import { faPhoneVolume, faShoppingCart, faInfoCircle, faTruck} from '@fortawesome/free-solid-svg-icons';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ShoopingCartComponent } from './pages/account/shopping-cart/shooping-cart.component';
import { isNullOrUndefined } from 'util';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService]
})
export class AppComponent {

  constructor(public dialogService: DialogService,
              private router:Router,
              private activatedRoute: ActivatedRoute) {}

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


    ngOnInit() {
      /*MEGA MENU*/
        this.megaMenuItems = [
            {
                label: 'Videos', icon: 'pi pi-fw pi-video',
                items: [
                    [
                        {
                            label: 'Video 1',
                            items: [{label: 'Video 1.1'}, {label: 'Video 1.2'}]
                        },
                        {
                            label: 'Video 2',
                            items: [{label: 'Video 2.1'}, {label: 'Video 2.2'}]
                        }
                    ],
                    [
                        {
                            label: 'Video 3',
                            items: [{label: 'Video 3.1'}, {label: 'Video 3.2'}]
                        },
                        {
                            label: 'Video 4',
                            items: [{label: 'Video 4.1'}, {label: 'Video 4.2'}]
                        }
                    ]
                ]
            },
            {
                label: 'Users', icon: 'pi pi-fw pi-users',
                items: [
                    [
                        {
                            label: 'User 1',
                            items: [{label: 'User 1.1'}, {label: 'User 1.2'}]
                        },
                        {
                            label: 'User 2',
                            items: [{label: 'User 2.1'}, {label: 'User 2.2'}]
                        },
                    ],
                    [
                        {
                            label: 'User 3',
                            items: [{label: 'User 3.1'}, {label: 'User 3.2'}]
                        },
                        {
                            label: 'User 4',
                            items: [{label: 'User 4.1'}, {label: 'User 4.2'}]
                        }
                    ],
                    [
                        {
                            label: 'User 5',
                            items: [{label: 'User 5.1'}, {label: 'User 5.2'}]
                        },
                        {
                            label: 'User 6',
                            items: [{label: 'User 6.1'}, {label: 'User 6.2'}]
                        }
                    ]
                ]
            },
            {
                label: 'Events', icon: 'pi pi-fw pi-calendar',
                items: [
                    [
                        {
                            label: 'Event 1',
                            items: [{label: 'Event 1.1'}, {label: 'Event 1.2'}]
                        },
                        {
                            label: 'Event 2',
                            items: [{label: 'Event 2.1'}, {label: 'Event 2.2'}]
                        }
                    ],
                    [
                        {
                            label: 'Event 3',
                            items: [{label: 'Event 3.1'}, {label: 'Event 3.2'}]
                        },
                        {
                            label: 'Event 4',
                            items: [{label: 'Event 4.1'}, {label: 'Event 4.2'}]
                        }
                    ]
                ]
            },
            {
                label: 'Settings', icon: 'pi pi-fw pi-cog',
                items: [
                    [
                        {
                            label: 'Setting 1',
                            items: [{label: 'Setting 1.1'}, {label: 'Setting 1.2'}]
                        },
                        {
                            label: 'Setting 2',
                            items: [{label: 'Setting 2.1'}, {label: 'Setting 2.2'}]
                        },
                        {
                            label: 'Setting 3',
                            items: [{label: 'Setting 3.1'}, {label: 'Setting 3.2'}]
                        }
                    ],
                    [
                        {
                            label: 'Technology 4',
                            items: [{label: 'Setting 4.1'}, {label: 'Setting 4.2'}]
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
                .subscribe( ()=> this.breadCrumbItems = this.createBreadCrumbs(this.activatedRoute.root))
            
        

        this.breadCrumbItems = [
          {label:'Categories'},
          {label:'Sports'},
          {label:'Football'},
          {label:'Countries'},
          {label:'Spain'},
          {label:'F.C. Barcelona'},
          {label:'Squad'},
          {label:'Lionel Messi'}
      ];
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
          console.log("------------------------------------")
          console.log("RUTA: "+url)
          console.log(" LABEL =>"+child.snapshot.data['breadcrumb'])
          const label = child.snapshot.data['breadcrumb'];
          if (!isNullOrUndefined(label)) {
            breadcrumbs.push({label, url});
          }
    
          return this.createBreadCrumbs(child, url, breadcrumbs);
        }
      }

}
