import { createAction, props } from '@ngrx/store';

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
export const actionSettingsCarritoVacio = createAction(
    '[Settings] Carrito Vacio',
    props<{carritoEstaVacio: boolean}>()
);
export const actionSettingsBuscador = createAction(
    '[Settings] Buscador Nav',
    props<{buscador: string}>()
);
export const actionSettingsCambiarProductoId = createAction(
    '[Settings] Cambiar Producto',
    props<{productoId: number}>()
);