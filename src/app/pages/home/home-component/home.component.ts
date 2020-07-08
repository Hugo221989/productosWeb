import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../products-page/service/products.service';
import { Producto, ProductoDto } from 'src/app/models/producto';
import { TranslateService } from '@ngx-translate/core';
import { Carousel } from 'primeng/carousel';
import { CategoriaPadre } from 'src/app/models/categoria';
import { Subscription, Observable } from 'rxjs';
import { actionSettingsBuscador } from 'src/app/settings/settings.actions';
import { selectSettingsBuscador } from 'src/app/settings/settings.selectors';
import { select, Store } from '@ngrx/store';
import { SettingsState } from 'src/app/settings/settings.model';
import { myAnimation } from 'src/app/animations/animation';
import { LoginService } from '../../login/logn-service/login.service';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [myAnimation]
})
export class HomeComponent implements OnInit {

  public productsNutricion: ProductoDto[] = [];
  public productsAlimentacion: ProductoDto[] = [];
  public productsPromociones: ProductoDto[] = [];
  public responsiveOptions;
  public language: string = "es";
  public subCatUrl: string;
  public catUrl: string;
  public images: any[] = [];
  public imagesLoaded: boolean = false;
  public blockedDocument: boolean = true;
  public productLoaded: Promise<boolean>;
  public contenedorBusquedaProducto: boolean = false;
  public textoBuscadorOvservable$: Observable<string>;
  private subscription: Subscription[] = [];
  public textoBuscador: string = null;
  private tokenUrlParam: string;
  public displayModalUserActivationOk: boolean = false;
  public userActivationTokenOk: boolean = false;

  constructor(private router:Router, 
              private productsService: ProductsService,
              public translate: TranslateService,
              private loginService: LoginService,
              private store: Store<{settings: SettingsState}>) { }

  ngOnInit(): void {
    this.getUrlParams();
    this.getImages();
    this.getLanguageBrowser();
    this.manageBuscadorSuperior();
    this.setResponsiveCarouselOptions();
    this.cargarProductosNutricion();
    this.cargarProductosAlimentacion();
    this.cargarProductosPromociones();
    this.unblockScreen();
  }

  getUrlParams(){
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('token')) {
      this.tokenUrlParam = searchParams.get('token');
      this.checkActivationUserToken();
    }
  }

  checkActivationUserToken(){
    this.loginService.checkActivationUserToken(this.tokenUrlParam).subscribe(data => {
      if(data){
        this.displayModalUserActivationOk = true;
        this.userActivationTokenOk = true;
      }else{
        this.displayModalUserActivationOk = true;
        this.userActivationTokenOk = false;
      }
    },error => {
      this.displayModalUserActivationOk = true;
      this.userActivationTokenOk = false;
    })
  }

  cargarProductosNutricion(){
    this.productsService.getProductsNutritionListRelacionados().subscribe( data =>{
      this.productsNutricion = data;
    })
  }

  cargarProductosAlimentacion(){
    this.productsService.getProductsFeedingListRelacionados().subscribe( data =>{
      this.productsAlimentacion = data;
    })
  }
  cargarProductosPromociones(){
    this.productsService.getProductsNutritionListRelacionados().subscribe( data =>{
      this.productsPromociones = data;
    })
  }

  seeCarouselProduct(modulo: string, product: ProductoDto){
    this.router.navigate([modulo, product.categoriaPadre, product.categoria , product.subCategoria, 'detail', product.id]);
    this.changeBreadcrumb(product.nombre, product.nombreEng);
  }

  irCategoriaGeneral(cat: string, subCat: string){
    this.router.navigate(['products', cat, 'all', 'all']);
  }

  irCategoriaGeneralFeeding(cat: string, subCat: string){
    this.router.navigate(['feeding', cat, 'all', 'all']);
  }

  changeBreadcrumb(nombre: string, nombreEng: string){
    this.productsService.cambiarBreadcrumb(nombre, nombreEng);
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

  setResponsiveCarouselOptions(){
    Carousel.prototype.changePageOnTouch = (e,diff) => {}
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 4,
          numScroll: 1
      },
      {
          breakpoint: '768px',
          numVisible: 4,
          numScroll: 1
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];
  }

    responsiveOptionsGaleriaProtada:any[] = [
      {
          breakpoint: '1024px',
          numVisible: 5
      },
      {
          breakpoint: '768px',
          numVisible: 3
      },
      {
          breakpoint: '560px',
          numVisible: 1
      }
  ];

getImages(){
  this.images = [];
  this.images.push({previewImageSrc:'assets/images/portada/portada1.jpg', alt:'Description for Image 1', title:'Title 1',
  thumbnailImageSrc:'assets/images/portada/portada1.jpg'});
  this.images.push({previewImageSrc:'assets/images/portada/portada2.jpg', alt:'Description for Image 1', title:'Title 1',
  thumbnailImageSrc:'assets/images/portada/portada2.jpg'});
  this.images.push({previewImageSrc:'assets/images/portada/portada3.jpg', alt:'Description for Image 1', title:'Title 1',
  thumbnailImageSrc:'assets/images/portada/portada3.jpg'});
  this.imagesLoaded = true;
}

unblockScreen(){
  this.blockedDocument = true;
  setTimeout(() => {
    this.blockedDocument = false;
    this.productLoaded = Promise.resolve(true); 
  }, 1000);
}


}
