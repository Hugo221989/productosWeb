import { createAction, props } from '@ngrx/store';
import { Cesta } from '../models/cesta';

export const actionSettingsIsAuthenticated = createAction(
    '[Auth] Is Authenticated',
    props<{isAuthenticated: boolean}>()
)
export const actionSettingsBreadcrumbExist = createAction(
    '[Settings] Breadcrumb Exist',
    props<{hayBreadcrumbFinal: boolean}>()
);
export const actionSettingsNombreBreadcrumb = createAction(
    '[Settings] Breadcrumb Name',
    props<{nombreBreadcrumbFinal: string}>()
);
export const actionSettingsNombreBreadcrumbEng = createAction(
    '[Settings] Breadcrumb Name ENg',
    props<{nombreBreadcrumbFinalEng: string}>()
);
export const actionSettingsCarritoVacio = createAction(
    '[Settings] Carrito Vacio',
    props<{carritoEstaVacio: boolean}>()
);
export const actionSettingsCesta = createAction(
    'Shopping Cart',
    props<{cesta: Cesta}>()
);
export const actionSettingsBuscador = createAction(
    '[Settings] Buscador Nav',
    props<{buscador: string}>()
);
export const actionSettingsCambiarProductoId = createAction(
    '[Settings] Cambiar Producto',
    props<{productoId: number}>()
);
export const actionSettingsCambiarLanguage = createAction(
    '[Settings] Cambiar Idioma',
    props<{language: number}>()
);