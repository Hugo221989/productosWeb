import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/models/producto';
import { ProductsService } from '../service/products.service';
import { ValorNutricional, InfoBasica, Sabor, Comentario, InfoVitaminas, Foto } from 'src/app/models/productoOtrosDatos';
import { SelectItem } from 'primeng/api/selectitem';
import { actionSettingsNombreBreadcrumb, actionSettingsCambiarProductoId } from 'src/app/settings/settings.actions';
import { SettingsState } from 'src/app/settings/settings.model';
import { Store, select } from '@ngrx/store';
import { selectSettingsBuscador, selectSettingsProductoId } from 'src/app/settings/settings.selectors';
import { Observable } from 'rxjs';
import { Carousel } from 'primeng/carousel';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
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
  saborSelected: any;
  cantidadSeleccionadaProducto: number = 1;

  products: Producto[] = [];
  responsiveOptions;

  sortField: string = "fecha";

  sortOrder: number;
  blockedDocument: boolean = false

  textoBuscadorOvservable$: Observable<string>;
  textoBuscador: string = null;
  contenedorBusquedaProducto: boolean = false;

  productoIdOvservable$: Observable<number>;

  subCatUrl: string;
  catUrl: string;

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
        this.idProduct = this.route.snapshot.paramMap.get("id");
        this.setProductoId();
        this.cambiarProducto();
        this.cargarProducto(this.idProduct);
        this.cargarProductosRelacionados();

        /*para el buscador*/
      this.manageBuscadorSuperior();

    }


    manageBuscadorSuperior(){
      /*para el buscador*/
      this.textoBuscadorOvservable$ = this.store.pipe(select(selectSettingsBuscador));
      this.textoBuscadorOvservable$.subscribe( (texto) => {
          this.textoBuscador = texto;
          if(this.textoBuscador != null && this.textoBuscador != ''){
            this.contenedorBusquedaProducto = true;
          }else{
            this.contenedorBusquedaProducto = false;
          }
      })
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
        this.images.push({source:`http://127.0.0.1:8887/${foto.ruta}`, alt:'Description for Image 1', title:'Title 1'});
    }

    cargarProductosRelacionados(){
      this.productsService.getProductsListRelacionados().subscribe( data =>{
        this.products = data;
      })
    }

    verProducto(id:number, nombre:string, nombreEng: string){
      this.productsService.getCatSubCatProduct(id).subscribe( data =>{
        if(data){
          this.catUrl = data.categoriaKey;
          this.subCatUrl = data.subCategoriaKey;

          this.cambiarBreadcrumb(nombre, nombreEng);
          this.router.navigate([`products`, this.catUrl, this.subCatUrl, 'detail', id]);
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
      product.saborSeleccionado = this.saborSelected;
      product.cantidad = this.cantidadSeleccionadaProducto;  

      this.blockedDocument = true;
      setTimeout(() => {
        this.blockedDocument = false;
      }, 1000);
      this.productsService.addProductToCart(product);
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
}
