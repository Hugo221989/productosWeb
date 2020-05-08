import { Producto } from './producto';

export class Cesta {
    id: number;
    cantidadProductos?: number;
    precioTotal?: number;
    productos: Producto[];
}