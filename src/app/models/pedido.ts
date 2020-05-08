import { Producto } from './producto';

export class Pedido {
    numPedido: string;
    fecha: Date;
    precio: string;
    metodoEnvio: string;
    destinatario: string;
    direccionEnvio: string
    productos: Producto[];
}
