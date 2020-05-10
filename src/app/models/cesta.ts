import { Producto } from './producto';

export class Cesta {
    id?: number;
    cantidadProductos?: number;
    importeTotal?: number;
    importeSubTotal?: number;
    envio?: number;
    productos: Producto[];
}