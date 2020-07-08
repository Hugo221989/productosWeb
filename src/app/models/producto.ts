import { Sabor, Comentario, ValorNutricional, Descripcion, Foto } from './productoOtrosDatos';
import { Categoria, SubCategoria } from './categoria';

export class Producto {
    id: number;
    nombre: string;
    nombreEng: string;
    precio: string;
    tamano: number;
    sabores: Sabor[];
    saborSeleccionado: Sabor;
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
    categoriaPadreNombre: string;
    categoriaPadreKey: string;
    categoriaPadreModulo: string;
    categoriaPadreId: number;
    categoriaNombre: string;
    categoriaKey: string;
    subCategoriaNombre: string;
    subCategoriaKey: string;
}

export class ProductoDto {
    id: number;
    categoriaPadre: string;
    categoria: string;
    subCategoria: string;
    nombre: string;
    nombreEng: string;
    precio: number;
    tamano: number;
    puntuacion: number;
    disponible: boolean;
    descuento: number;
    precioFinal: number;
    descripcion: string;
    foto: string;
}