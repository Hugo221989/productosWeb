import { Component, OnInit, Input } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { Comentario, Sabor, Foto, Descripcion, InfoBasica, InfoVitaminas, ValorNutricional } from 'src/app/models/productoOtrosDatos';
import { ProductsService } from '../../products-page/service/products.service';
import { Cesta } from 'src/app/models/cesta';

@Component({
  selector: 'app-shooping-cart',
  templateUrl: './shooping-cart.component.html',
  styleUrls: ['./shooping-cart.component.scss']
})
export class ShoopingCartComponent implements OnInit {

  @Input()
  cesta: Cesta;
  products: Producto[];
  subtotal: string;
  total: string;
  envio: string;
  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.products = [];
    this.cesta = this.productsService.getProductosCesta();
    this.products = this.cesta.productos;
  }

  eliminarProducto(index: number){
    this.cesta = this.productsService.removeProductoCesta(index);
    this.products = this.cesta.productos;
  }

}
