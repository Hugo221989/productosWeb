export class User {
    id: number;
    nombre: string;
    apellido: string;
    usuario: string;
    nacimiento: Date;
    email: string;
    telefono: string;
    admin: boolean;
    direccion: UsuarioDireccion[];
    genero: Genero;
}

export class Genero {
    id: number;
    nombre: string;
}

export class UsuarioDireccion{
    id?: number;
    destinatario: string;
    calle: string;
    piso: string;
    codigoPostal: string;
    localidad: string;
    telefono: string;
    datosAdicionales: string;
}