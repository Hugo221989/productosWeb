import { Component, OnInit, Input } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { ProductsService } from '../../products-page/service/products.service';
import { Cesta } from 'src/app/models/cesta';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shooping-cart',
  templateUrl: './shooping-cart.component.html',
  styleUrls: ['./shooping-cart.component.scss']
})
export class ShoopingCartComponent implements OnInit {

  language: string = "es";

  @Input()
  cesta: Cesta;
  products: Producto[];
  subtotal: string;
  total: string;
  envio: string;
  constructor(private productsService: ProductsService, 
    private router:Router,
    public translate: TranslateService) { }

  ngOnInit(): void {
    this.getLanguageBrowser();
    this.products = [];
    this.cesta = this.productsService.getProductosCesta();
    this.products = this.cesta.productos;
  }

  eliminarProducto(index: number){
    this.cesta = this.productsService.removeProductoCesta(index);
    this.products = this.cesta.productos;
  }

  irCesta(){
    this.router.navigate(['cart']);
  }

  getLanguageBrowser(){
    this.language = this.productsService.getLanguageBrowser();
    }

}
