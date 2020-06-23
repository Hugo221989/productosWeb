import { Component, OnInit, Input } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { ProductsService } from '../../products-page/service/products.service';
import { Cesta, ProductoCesta } from 'src/app/models/cesta';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SettingsState } from 'src/app/settings/settings.model';
import { Store, select } from '@ngrx/store';
import { selectSettingsCesta } from 'src/app/settings/settings.selectors';

@Component({
  selector: 'app-shooping-cart',
  templateUrl: './shooping-cart.component.html',
  styleUrls: ['./shooping-cart.component.scss']
})
export class ShoopingCartComponent implements OnInit {

  language: string = "es";

  @Input()
  cesta: Cesta;
  productsCesta: ProductoCesta[];
  subtotal: string;
  total: string;
  envio: string;
  constructor(private productsService: ProductsService, 
    private router:Router,
    public translate: TranslateService,
    private store: Store<{settings: SettingsState}>,) { }

  ngOnInit(): void {
    this.getLanguageBrowser();
   this.getProductsCart();
  }

  getProductsCart(){
    this.productsCesta = [];
      this.cesta = {
        productosCesta: this.productsCesta
      }
    this.store.pipe(select(selectSettingsCesta)).subscribe(data =>{
      this.cesta = data;
      this.productsCesta = this.cesta.productosCesta;
    })
/*     this.productsService.getProductosCesta().subscribe(data =>{
      this.cesta = data;
      this.productsCesta = this.cesta.productosCesta;
    }) */
    //this.cesta = this.productsService.getProductosCesta();
    //this.productsCesta = this.cesta.productosCesta;
  }

  eliminarProducto(index: number){
    this.cesta = this.productsService.removeProductoCesta(index);
    this.productsCesta = this.cesta.productosCesta;
  }

  irCesta(){
    this.router.navigate(['/cart/paso1/']);
  }

  getLanguageBrowser(){
    this.language = this.productsService.getLanguageBrowser();
    }

}
