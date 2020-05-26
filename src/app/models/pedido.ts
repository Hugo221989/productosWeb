import { Producto } from './producto';
import { UsuarioDireccion } from './user';

export class Pedido {
    id: number;
    numPedido: string;
    fechaPedido: Date;
    precioTotal: number;
    precioEnvio: number;
    cantidadProductos: number;
    finalizado: boolean;
    pagado: boolean;
    enviado: boolean;
    metodoEnvio: MetodoEnvio;
    destinatario: string;
    direccionEnvio: UsuarioDireccion;
    productos: Producto[];
}

export class MetodoEnvio {
    id: number;
    nombre: string;
    nombreEng: string;
    descripcion: string;
    descripcionEng: string;
}
