import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../../products-page/service/products.service';
import { Producto } from 'src/app/models/producto';
import { TranslateService } from '@ngx-translate/core';
import { Carousel } from 'primeng/carousel';
import { CategoriaPadre } from 'src/app/models/categoria';
import { Galleria } from 'primeng/galleria';

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

    this.getImages();
    this.bindDocumentListeners();

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



    images: any[];
    showThumbnails: boolean;
    fullscreen: boolean = false;
    activeIndex: number = 0;
    onFullScreenListener: any;
    @ViewChild('galleria') galleria: Galleria;

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

  onThumbnailButtonClick() {
    this.showThumbnails = !this.showThumbnails;
}

onFullScreenChange() {
    this.fullscreen = !this.fullscreen;
}

closePreviewFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    else if (document['mozCancelFullScreen']) {
        document['mozCancelFullScreen']();
    }
    else if (document['webkitExitFullscreen']) {
        document['webkitExitFullscreen']();
    }
    else if (document['msExitFullscreen']) {
        document['msExitFullscreen']();
    }
}

bindDocumentListeners() {
    this.onFullScreenListener = this.onFullScreenChange.bind(this);
    document.addEventListener("fullscreenchange", this.onFullScreenListener);
    document.addEventListener("mozfullscreenchange", this.onFullScreenListener);
    document.addEventListener("webkitfullscreenchange", this.onFullScreenListener);
    document.addEventListener("msfullscreenchange", this.onFullScreenListener);
}

unbindDocumentListeners() {
    document.removeEventListener("fullscreenchange", this.onFullScreenListener);
    document.removeEventListener("mozfullscreenchange", this.onFullScreenListener);
    document.removeEventListener("webkitfullscreenchange", this.onFullScreenListener);
    document.removeEventListener("msfullscreenchange", this.onFullScreenListener);
    this.onFullScreenListener = null;
}

ngOnDestroy() {
    this.unbindDocumentListeners();
}

galleriaClass() {
    return `custom-galleria ${this.fullscreen ? 'fullscreen' : ''}`;
}

fullScreenIcon() {
    return `pi ${this.fullscreen ? 'pi-window-minimize' : 'pi-window-maximize'}`;
}

getImages(){
  this.images = [];
  this.images.push("portada1.jpg", "portada2.jpg", "portada3.jpg")
}

}
