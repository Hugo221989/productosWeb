import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Producto, ProductoDto } from 'src/app/models/producto';
import { ProductsService } from '../service/products.service';
import { ValorNutricional, InfoBasica, Sabor, Comentario, InfoVitaminas, Foto } from 'src/app/models/productoOtrosDatos';
import { SelectItem } from 'primeng/api/selectitem';
import { actionSettingsCambiarProductoId, actionSettingsBuscador } from 'src/app/settings/settings.actions';
import { SettingsState } from 'src/app/settings/settings.model';
import { Store, select } from '@ngrx/store';
import { selectSettingsBuscador, selectSettingsProductoId } from 'src/app/settings/settings.selectors';
import { Observable, Subscription } from 'rxjs';
import { Carousel } from 'primeng/carousel';
import { CategoriaPadre } from 'src/app/models/categoria';
import { ProductoCesta } from 'src/app/models/cesta';
import { myAnimation } from 'src/app/animations/animation';

const SERVER_IMAGES = 'http://127.0.0.1:8887/';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  animations: [myAnimation]
})

export class ProductDetailComponent implements OnInit, OnDestroy {
  language: string = "es";

  productImages: any[];
  product: Producto;
  valorNutricional: ValorNutricional;
  infoBasica: InfoBasica;
  vitaminas: InfoVitaminas[] = [];
  idProduct;
  productLoaded: Promise<boolean>;
  sabores: Sabor[];
  productoComentarios: Comentario[] = [];
  fotos: Foto[] = [];
  saboresItems: SelectItem[];
  saborSelected: Sabor;
  cantidadSeleccionadaProducto: number = 1;

  relatedProductsNutritionCarousel: ProductoDto[] = [];
  relatedProductsFeedingCarousel: ProductoDto[] = [];
  relatedProductsPromotionsCarousel: ProductoDto[] = [];
  responsiveCarouselOptions;
  blockedDocument: boolean = false

  textoBuscadorOvservable$: Observable<string>;
  private subscription: Subscription[] = [];
  textoBuscador: string = null;
  contenedorBusquedaProducto: boolean = false;

  productoIdOvservable$: Observable<number>;

  subCategoriaUrl: string;
  categoriaUrl: string;
  categoriaPadreUrl: string;
  modulo: string;

  constructor(private router:Router, private productsService: ProductsService,
              private route: ActivatedRoute,
              private store: Store<{settings: SettingsState}>) {

      this.adaptCarouselTouchToMobile();
      this.setResponsiveCarouselOptions();
    
   }

   producto: Producto;

   ngOnInit() {
        this.getLanguageBrowser();
        this.getUrlParams();
        this.setProductoIdInStore();
        this.changeProductIdFromStore();
        this.loadRelatedCarouselProducts();
        setTimeout(() => {
          this.manageBuscadorTextoSuperior();
        }, 300);
        this.gotoTopPage();
    }

    getUrlParams(){
      this.categoriaPadreUrl = this.route.snapshot.paramMap.get("catPadre");
      this.subCategoriaUrl = this.route.snapshot.paramMap.get("subcat");  
      this.categoriaUrl = this.route.snapshot.paramMap.get("cat");
      this.idProduct = this.route.snapshot.paramMap.get("id");

      const children: ActivatedRoute[] = this.route.root.children;
      let modulo = children[0].snapshot.data['modulo'];
      this.modulo = modulo;
    }

    manageBuscadorTextoSuperior(){
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

    loadProductById(id: number){
      this.productsService.getProductById(id).subscribe( data =>{
        this.product = data;
        if(this.product.valorNutricional){
          this.valorNutricional = this.product.valorNutricional;
          if(this.valorNutricional.infoBasica){
            this.infoBasica = this.valorNutricional.infoBasica;
          }
          if(this.valorNutricional.infoVitaminas){
            this.vitaminas = this.valorNutricional.infoVitaminas;
          }
        }
        if(this.product.fotos){
          this.fotos = this.product.fotos;
        }
        this.productLoaded = Promise.resolve(true); 
        this.loadFlavours();
        this.loadProductReviews();
        this.loadProductImages();
      })
    }

    loadFlavours(){
      this.sabores = this.product.sabores;
      this.saborSelected = this.sabores[0];
      this.saboresItems = [];
      for(let sabor of this.sabores){
        let saborText: string = "";
        if(this.language == "en"){
          saborText =sabor.saborEng;
        }else{
          saborText = sabor.sabor;
        }
        this.saboresItems.push({label:saborText, value:sabor});
      }
    }

    loadProductReviews(){
      this.productoComentarios = this.product.comentarios;
    }
    
    loadProductImages(){
      this.productImages = [];
      for(let foto of this.fotos)
        this.productImages.push({previewImageSrc:`${SERVER_IMAGES}${foto.ruta}`, alt:'Description for Image 1', title:'Title 1',
        thumbnailImageSrc:`${SERVER_IMAGES}${foto.ruta}`});
    }

    loadRelatedCarouselProducts(){
      this.productsService.getProductsNutritionListRelacionados().subscribe( data =>{
        this.relatedProductsNutritionCarousel = data;
      })
    }

    seeCarouselProduct(product: ProductoDto){
      this.router.navigate([this.modulo, product.categoriaPadre, product.categoria , product.subCategoria, 'detail', product.id]);
      this.changeBreadcrumb(product.nombre, product.nombreEng);
      this.loadProductById(product.id);
      this.gotoTopPage();
    }

    gotoTopPage() {
      window.scroll({ 
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
      });
    }

    changeBreadcrumb(nombre: string, nombreEng: string){
      this.productsService.cambiarBreadcrumb(nombre, nombreEng);
    }

    addProductToCart(product: Producto){
      let sabor:Sabor = {
        id: this.saborSelected.id,
        sabor: this.saborSelected.sabor,
        saborEng: this.saborSelected.saborEng
      }
      let productoCesta: ProductoCesta = {
        cantidad: this.cantidadSeleccionadaProducto,
        saborSeleccionado: sabor,
        producto: product
      }
      this.blockedDocument = true;
      setTimeout(() => {
        this.blockedDocument = false;
      }, 1000);
      this.productsService.addProductToCart(productoCesta);
    }

    changeProductIdFromStore(){
      this.productoIdOvservable$ = this.store.pipe(select(selectSettingsProductoId));
      this.productoIdOvservable$.subscribe( (id) => {
        this.loadProductById(id);
      })
    }

    setProductoIdInStore(){
      this.store.dispatch(actionSettingsCambiarProductoId({
        productoId: this.idProduct
      }))
    }

    getLanguageBrowser(){
      this.language = this.productsService.getLanguageBrowser();
    }
    adaptCarouselTouchToMobile(){
      Carousel.prototype.changePageOnTouch = (e,diff) => {}
    }
    setResponsiveCarouselOptions(){
      this.responsiveCarouselOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
      ];
    }

    ngOnDestroy(){
      this.subscription.forEach(s => s.unsubscribe());
    }
}
