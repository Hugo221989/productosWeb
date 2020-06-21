import { Producto } from './producto';
import { User } from './user';
import { Sabor } from './productoOtrosDatos';

export class Cesta {
    id?: number;
    cantidadProductos?: number;
    importeTotal?: number;
    importeSubTotal?: number;
    envio?: number;
    productosCesta: ProductoCesta[];
    usuario?: User;
}

export class ProductoCesta {
    id?: number;
    producto: Producto;
    saborSeleccionado: Sabor;
    cantidad: number;
}

export class MetodoEnvio {
    id?: number;
    nombre: string;
    nombreEng: string;
    descripcion: string;
    descripcionEng: string;
    icono: string;
}

export class MetodoPago {
    id?: number;
    nombre: string;
    nombreEng: string;
    descripcion: string;
    descripcionEng: string;
    icono: string;
}

