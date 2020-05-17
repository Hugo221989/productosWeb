import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/models/pedido';
import { Producto } from 'src/app/models/producto';
import { Descripcion, Comentario, Foto, Sabor, ValorNutricional, InfoBasica, InfoVitaminas } from 'src/app/models/productoOtrosDatos';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  descripcion:Descripcion = {
    id: 1,
    titulo: 'Proteina',
    subtitulo: 'Suero de Proteina',
    apartado: 'Apartado 1 con muchos datos',
    beneficios: 'Beneficios multiples',
    caracteristicas: 'Muchas caracteristicas'
  }
  comentarios: Comentario[] = [];
  fotos: Foto[] = [];
  sabores: Sabor[] = [];
  inforBasica: InfoBasica = {
    id: 1
  }
  infoVitaminas: InfoVitaminas[] = [];
  valorNutricional: ValorNutricional = {
    id: 1,
    advertencias: '',
    alergias: '',
    conservacion: '',
    dosis: 35,
    dosisDiaria: 35,
    dosisEnvase: 66,
    infoBasica: this.inforBasica,
    infoVitaminas: this.infoVitaminas,
    ingredientes: '',
    modoEmpleo: '',
    otrosIngredientes: ''
  }
  productos: Producto[] = [];
  pedidos: Pedido[] = [];
  
/*   productos: Producto[] = [
    {
      nombre: 'Televisor 24',
      precio: '344',
      precioFinal: '344',
      descripcion: this.descripcion,
      disponible: true,
      comentarios: this.comentarios,
      descuento: 0,
      fotos: this.fotos,
      id: 1,
      puntuacion: 4,
      saborSeleccionado: '',
      sabores: this.sabores,
      tamano: 2000,
      valorNutricional: this.valorNutricional,
      cantidad: 1
    },
    {
      nombre: 'Televisor 24',
      precio: '344',
      precioFinal: '344',
      descripcion: this.descripcion,
      disponible: true,
      comentarios: this.comentarios,
      descuento: 0,
      fotos: this.fotos,
      id: 2,
      puntuacion: 5,
      saborSeleccionado: '',
      sabores: this.sabores,
      tamano: 2000,
      valorNutricional: this.valorNutricional,
      cantidad: 1
    }
  ] */
/* 
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
  ] */

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
