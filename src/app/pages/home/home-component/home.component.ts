import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../../products-page/service/products.service';
import { Producto } from 'src/app/models/producto';
import { TranslateService } from '@ngx-translate/core';
import { Carousel } from 'primeng/carousel';
import { CategoriaPadre } from 'src/app/models/categoria';

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

  constructor(private router:Router, 
              private productsService: ProductsService,
              public translate: TranslateService) { }

  ngOnInit(): void {
    this.getLanguageBrowser();
    this.responsiveCarousel();
    this.cargarProductosNutricion();
    this.cargarProductosAlimentacion();
    this.cargarProductosPromociones();
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

  verProducto(id:number, nombre:string, nombreEng: string){
    this.productsService.getCatSubCatProduct(id).subscribe( data =>{
      if(data){
        this.catUrl = data.categoriaKey;
        this.subCatUrl = data.subCategoriaKey;

        this.cambiarBreadcrumb(nombre, nombreEng);
        this.router.navigate([`products`, this.catUrl, this.subCatUrl, 'detail', id]);
      }
    })
  }

  irCategoriaGeneral(cat: string, subCat: string){
    this.router.navigate(['products', cat, subCat]);
    setTimeout(() => {
      /* this.reloadPage(); */  
    }, 500);
    
  }

  irCategoriaGeneralFeeding(cat: string, subCat: string){
    this.router.navigate(['feeding', cat, subCat]);
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

}
