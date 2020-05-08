import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/models/producto';
import { ProductsService } from '../service/products.service';
import { ValorNutricional, InfoBasica, Sabor, Comentario, InfoVitaminas, Foto } from 'src/app/models/productoOtrosDatos';
import { SelectItem } from 'primeng/api/selectitem';
import { actionSettingsNombreBreadcrumb } from 'src/app/settings/settings.actions';
import { SettingsState } from 'src/app/settings/settings.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

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

  products: Producto[] = [];
  responsiveOptions;

  sortField: string = "fecha";

  sortOrder: number;

  constructor(private router:Router, private productsService: ProductsService,
              private route: ActivatedRoute,
              private store: Store<{settings: SettingsState}>) {
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
       console.log("CARGANDO PAGINA")
        //this.producto = history.state;
        this.idProduct = this.route.snapshot.paramMap.get("id");

        this.cargarProducto(this.idProduct);
        this.cargarProductosRelacionados();

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
      this.saboresItems = [];
      for(let sabor of this.sabores){
        this.saboresItems.push({label:sabor.sabor, value:sabor});
      }
    }

    cargarComentarios(){
      this.comentarios = this.product.comentarios;
      console.log("COMENTARIOS: ",this.comentarios)
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

    verProducto(id:number, nombre:string){
      this.gotoTop();
      this.cambiarBreadcrumb(nombre);
      this.router.navigate(['products/detail', id]);
      this.cargarProducto(id);
    }

    gotoTop() {
      window.scroll({ 
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
      });
    }

    cambiarBreadcrumb(nombre: string){
      this.store.dispatch(actionSettingsNombreBreadcrumb({
        nombreBreadcrumbFinal: nombre
      }))
    }

}
