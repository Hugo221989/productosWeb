import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/pedido';

@Component({
  selector: 'app-shooping-cart',
  templateUrl: './shooping-cart.component.html',
  styleUrls: ['./shooping-cart.component.scss']
})
export class ShoopingCartComponent implements OnInit {


  productos: Producto[] = [
    {
      nombre: 'Televisor 24',
      cantidad: 1,
      precio: '344',
      precioTotal: '344'
    },
    {
      nombre: 'Patinete',
      cantidad: 2,
      precio: '260',
      precioTotal: '520'
    }
  ]
  
  constructor() { }

  ngOnInit(): void {
  }

}
