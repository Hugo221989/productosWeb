export class CategoriaPadre {
    id: number;
    nombre: string;
    nombreEng: string;
    key: string;
    categoria: Categoria[];
}

export class Categoria {
    id: number;
    nombre: string;
    nombreEng: string;
    subCategoria: SubCategoria[];
    key: string;
}

export class SubCategoria {
    id: number;
    nombre: string;
    nombreEng: string;
    key: string;
}
