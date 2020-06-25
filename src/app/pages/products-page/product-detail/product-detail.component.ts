import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/models/producto';
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

  images: any[];
  product: Producto;
  valorNutricional: ValorNutricional;
  infoBasica: InfoBasica;
  vitaminas: InfoVitaminas[] = [];
  idProduct;
  productLoaded: Promise<boolean>;
  sabores: Sabor[];
  comentarios: Comentario[] = [];
  fotos: Foto[] = [];
  saboresItems: SelectItem[];
  saborSelected: Sabor;
  cantidadSeleccionadaProducto: number = 1;

  productsNutrition: Producto[] = [];
  productsFeeding: Producto[] = [];
  productsPromotions: Producto[] = [];
  responsiveOptions;

  sortField: string = "fecha";

  sortOrder: number;
  blockedDocument: boolean = false

  textoBuscadorOvservable$: Observable<string>;
  private subscription: Subscription[] = [];
  textoBuscador: string = null;
  contenedorBusquedaProducto: boolean = false;

  productoIdOvservable$: Observable<number>;

  subCatUrl: string;
  catUrl: string;
  catPadreUrl: string;

  constructor(private router:Router, private productsService: ProductsService,
              private route: ActivatedRoute,
              private store: Store<{settings: SettingsState}>) {
    Carousel.prototype.changePageOnTouch = (e,diff) => {}
    this.responsiveOptions = [
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

   producto: Producto;

   ngOnInit() {
        //this.producto = history.state;
        this.getLanguageBrowser();
        this.getUrlParams();
        this.idProduct = this.route.snapshot.paramMap.get("id");
        this.setProductoId();
        this.cambiarProducto();
        this.cargarProducto(this.idProduct);
        this.cargarProductosRelacionados();

        /*para el buscador*/
        setTimeout(() => {
          this.manageBuscadorSuperior();
        }, 300);
    }

    getUrlParams(){
      this.catPadreUrl = this.route.snapshot.paramMap.get("catPadre");
      this.subCatUrl = this.route.snapshot.paramMap.get("subcat");  
      this.catUrl = this.route.snapshot.paramMap.get("cat");
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

    cargarProducto(id: number){
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
        this.cargarSabores();
        this.cargarComentarios();
        this.cargarImagenes();
      })
    }

    cargarSabores(){
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

    cargarComentarios(){
      this.comentarios = this.product.comentarios;
    }
    
    cargarImagenes(){
      this.images = [];
      for(let foto of this.fotos)
        this.images.push({previewImageSrc:`${SERVER_IMAGES}${foto.ruta}`, alt:'Description for Image 1', title:'Title 1',
        thumbnailImageSrc:`${SERVER_IMAGES}${foto.ruta}`});
    }

    cargarProductosRelacionados(){
      this.productsService.getProductsNutritionListRelacionados().subscribe( data =>{
        let categoriaPadre: CategoriaPadre = data;
        this.productsNutrition = [];
        for(let cats of categoriaPadre.categoria){
          for(let prod of cats.productos){
            this.productsNutrition.push(prod);
          }
        }
      })
    }

    verProducto(id:number, nombre:string, nombreEng: string){
      this.productsService.getCatSubCatProduct(id).subscribe( data =>{
        if(data){
          let categoriaPadre = data.categoriaPadreModulo;
          let categoriaPadreId = data.categoriaPadreId;
          let categoria = data.categoriaKey;
          let subCategoria = data.subCategoriaKey;
          this.catUrl = data.categoriaKey;
          this.subCatUrl = data.subCategoriaKey;

          this.cambiarBreadcrumb(nombre, nombreEng);
          this.router.navigate([categoriaPadre, categoriaPadreId, categoria, subCategoria, 'detail', id]);
          this.cargarProducto(id);
          this.gotoTop();
        }
      })
    }

    gotoTop() {
      window.scroll({ 
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
      });
    }

    cambiarBreadcrumb(nombre: string, nombreEng: string){
      this.productsService.cambiarBreadcrumb(nombre, nombreEng);
    }

    addProduct(product: Producto){
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

    cambiarProducto(){
      this.productoIdOvservable$ = this.store.pipe(select(selectSettingsProductoId));
      this.productoIdOvservable$.subscribe( (id) => {
        this.cargarProducto(id);
      })
    }

    setProductoId(){
      this.store.dispatch(actionSettingsCambiarProductoId({
        productoId: this.idProduct
      }))
    }

    getLanguageBrowser(){
      this.language = this.productsService.getLanguageBrowser();
      }

      ngOnDestroy(){
        this.subscription.forEach(s => s.unsubscribe());
      }
}
