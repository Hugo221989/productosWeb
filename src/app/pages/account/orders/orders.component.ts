import { Component, OnInit } from '@angular/core';
import { Pedido, Producto } from 'src/app/models/pedido';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

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

  pedidos: Pedido[] = [
    {
      precio: '23.50',
      metodoEnvio: 'Nacex 24h',
      destinatario: 'Hugo Onetto',
      direccionEnvio: 'Francisco Moreno Usedo 18',
      fecha: new Date(),
      numPedido: 'IX99877S',
      productos: this.productos
    },{
      precio: '100',
      metodoEnvio: 'Correos Express',
      destinatario: 'Hugo Onetto',
      direccionEnvio: 'Francisco Moreno Usedo 18',
      fecha: new Date(),
      numPedido: 'PX99878G',
      productos: this.productos
    },{
      precio: '10.95',
      metodoEnvio: 'Nacex 24h',
      destinatario: 'Hugo Onetto',
      direccionEnvio: 'Francisco Moreno Usedo 18',
      fecha: new Date(),
      numPedido: 'IZ99117S',
      productos: this.productos
    }
  ]

  constructor() { }

  cols: any[];

  ngOnInit(): void {

    this.cols = [
      { field: 'nombre', header: 'Productos' },
      { field: 'precio', header: 'Precio' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'precioTotal', header: 'Sub-total' }
  ];

  }

}
