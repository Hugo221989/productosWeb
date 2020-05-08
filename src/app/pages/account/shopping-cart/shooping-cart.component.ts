import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { Comentario, Sabor, Foto, Descripcion, InfoBasica, InfoVitaminas, ValorNutricional } from 'src/app/models/productoOtrosDatos';

@Component({
  selector: 'app-shooping-cart',
  templateUrl: './shooping-cart.component.html',
  styleUrls: ['./shooping-cart.component.scss']
})
export class ShoopingCartComponent implements OnInit {


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
  
  productos: Producto[] = [
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
      valorNutricional: this.valorNutricional
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
      valorNutricional: this.valorNutricional
    }
  ]
  
  constructor() { }

  ngOnInit(): void {
  }

}
