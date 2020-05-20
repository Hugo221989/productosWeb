export class Comentario{
    id: number;
    autor: string;
    opinion: string;
    fecha: Date;
    puntuacion: number;
}

export class Descripcion{
    id: number;
    titulo: string;
    tituloEng: string;
    subtitulo: string;
    subtituloEng: string;
    apartado: string;
    apartadoEng: string;
    caracteristicas: string;
    caracteristicasEng: string;
    beneficios: string;
    beneficiosEng: string;
}

export class InfoVitaminas{
    id: number;
    nombre?: string;
    nombreEng?: string;
    valor?: string;
}

export class InfoBasica{
    id: number;
    valorEnergetico?: number;
    proteinas?: number;
    hidratos?: number;
    azucares?: number;
    grasas?: number;
    saturadas?: number;
    sodio?: number;
}

export class ValorNutricional{
    id: number;
    dosis: number;
    dosisEnvase: number;
    dosisDiaria: number;
    infoBasica: InfoBasica;
    infoVitaminas: InfoVitaminas[];
    ingredientes: string;
    otrosIngredientes: string;
    conservacion: string;
    alergias: string;
    modoEmpleo: string;
    advertencias: string;
    ingredientesEng: string;
    otrosIngredientesEng: string;
    conservacionEng: string;
    alergiasEng: string;
    modoEmpleoEng: string;
    advertenciasEng: string;
}

export class Sabor{
    id: number;
    sabor: string;
    saborEng: string;
}

export class Foto{
    id: number;
    ruta: string;
    principal: boolean;
}