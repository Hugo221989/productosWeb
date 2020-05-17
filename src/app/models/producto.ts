import { Sabor, Comentario, ValorNutricional, Descripcion, Foto } from './productoOtrosDatos';
import { Categoria, SubCategoria } from './categoria';

export class Producto {
    id: number;
    nombre: string;
    precio: string;
    tamano: number;
    sabores: Sabor[];
    saborSeleccionado: string;
    cantidad: number;
    puntuacion: number;
    comentarios: Comentario[];
    disponible: boolean;
    fotos: Foto[];
    descuento: number;
    valorNutricional: ValorNutricional;
    descripcion: Descripcion;
    precioFinal: string;
    categoria: Categoria;
    subCategoria: SubCategoria;
}

export class CatProductoDto{
    id: number;
    categoriaNombre: string;
    categoriaKey: string;
    subCategoriaNombre: string;
    subCategoriaKey: string;
}