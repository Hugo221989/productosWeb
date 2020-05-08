import { Sabor, Comentario, ValorNutricional, Descripcion, Foto } from './productoOtrosDatos';

export class Producto {
    id: number;
    nombre: string;
    precio: string;
    tamano: number;
    sabores: Sabor[];
    saborSeleccionado: string;
    puntuacion: number;
    comentarios: Comentario[];
    disponible: boolean;
    fotos: Foto[];
    descuento: number;
    valorNutricional: ValorNutricional;
    descripcion: Descripcion;
    precioFinal: string;
}