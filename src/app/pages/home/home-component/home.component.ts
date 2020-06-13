import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../../products-page/service/products.service';
import { Producto } from 'src/app/models/producto';
import { TranslateService } from '@ngx-translate/core';
import { Carousel } from 'primeng/carousel';
import { CategoriaPadre } from 'src/app/models/categoria';
import { Galleria } from 'primeng/galleria';
import { Subscription, Observable } from 'rxjs';
import { actionSettingsBuscador } from 'src/app/settings/settings.actions';
import { selectSettingsBuscador } from 'src/app/settings/settings.selectors';
import { select, Store } from '@ngrx/store';
import { SettingsState } from 'src/app/settings/settings.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  productsNutricion: Producto[] = [];
  productsAlimentacion: Producto[] = [];
  productsPromociones: Producto[] = [];
  responsiveOptions;
  language: string = "es";
  subCatUrl: string;
  catUrl: string;
  images: any[] = [];
  imagesLoaded: boolean = false;

  blockedDocument: boolean = true;
  productLoaded: Promise<boolean>;
  contenedorBusquedaProducto: boolean = false;
  textoBuscadorOvservable$: Observable<string>;
  private subscription: Subscription[] = [];
  textoBuscador: string = null;

  constructor(private router:Router, 
              private productsService: ProductsService,
              public translate: TranslateService,
              private store: Store<{settings: SettingsState}>) { }

  ngOnInit(): void {
    this.getImages();
    this.getLanguageBrowser();
    this.manageBuscadorSuperior();
    this.responsiveCarousel();
    this.cargarProductosNutricion();
    this.cargarProductosAlimentacion();
    this.cargarProductosPromociones();
    this.unblockScreen();
  }


  cargarProductosNutricion(){
    this.productsService.getProductsNutritionListRelacionados().subscribe( data =>{
      let categoriaPadre: CategoriaPadre = data;
      for(let cats of categoriaPadre.categoria){
        for(let prod of cats.productos){
          this.productsNutricion.push(prod);
        }
      }
    })
  }

  cargarProductosAlimentacion(){
    this.productsService.getProductsFeedingListRelacionados().subscribe( data =>{
      let categoriaPadre: CategoriaPadre = data;
      for(let cats of categoriaPadre.categoria){
        for(let prod of cats.productos){
          this.productsAlimentacion.push(prod);
        }
      }

      console.log("alimentacion: ",this.productsAlimentacion.length);
    })
  }
  cargarProductosPromociones(){
    this.productsService.getProductsNutritionListRelacionados().subscribe( data =>{
      let categoriaPadre: CategoriaPadre = data;
      for(let cats of categoriaPadre.categoria){
        for(let prod of cats.productos){
          this.productsPromociones.push(prod);
        }
      }
    })
  }

  verProducto(id:number, nombre:string, nombreEng: string, categoriaPadre: string, apartadoMenu: string){
    this.productsService.getCatSubCatProduct(id).subscribe( data =>{
      if(data){
        this.catUrl = data.categoriaKey;
        this.subCatUrl = data.subCategoriaKey;

        this.cambiarBreadcrumb(nombre, nombreEng);
        this.router.navigate([ apartadoMenu, categoriaPadre, this.catUrl, this.subCatUrl, 'detail', id]);
      }
    })
  }

  irCategoriaGeneral(cat: string, subCat: string){
    let catPadre: string = "1";
    this.router.navigate(['products', catPadre, cat, subCat]);
    setTimeout(() => {
      /* this.reloadPage(); */  
    }, 500);
    
  }

  irCategoriaGeneralFeeding(cat: string, subCat: string){
    let catPadre: string = "2";
    this.router.navigate(['feeding', catPadre, cat, subCat]);
    setTimeout(() => {
      /* this.reloadPage(); */  
    }, 500);
    
  }

  cambiarBreadcrumb(nombre: string, nombreEng: string){
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

  responsiveCarousel(){
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
  console.log("iamges: ",this.images);
}

unblockScreen(){
  this.blockedDocument = true;
  setTimeout(() => {
    this.blockedDocument = false;
    this.productLoaded = Promise.resolve(true); 
  }, 1000);
}


}
