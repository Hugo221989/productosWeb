export class Pedido {
    numPedido: string;
    fecha: Date;
    precio: string;
    metodoEnvio: string;
    destinatario: string;
    direccionEnvio: string
    productos: Producto[];
}

export class Producto {
    nombre: string;
    precio: string;
    cantidad: number;
    precioTotal: string;
}