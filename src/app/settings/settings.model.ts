import { Cesta } from '../models/cesta';

export interface SettingsState {
    isAuthenticated: boolean;
    hayBreadcrumbFinal: boolean;
    nombreBreadcrumbFinal: string;
    nombreBreadcrumbFinalEng: string;
    carritoEstaVacio: boolean;
    cesta: Cesta;
    buscador: string;
    productoId: number;
    language: number;
}

