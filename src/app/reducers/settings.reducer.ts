import * as SettingsActions from '../settings/settings.actions';
import { createReducer, on, Action } from '@ngrx/store';
import { SettingsState } from '../settings/settings.model';


export const initialState: SettingsState = {
    isAuthenticated: false,
    hayBreadcrumbFinal: false,
    nombreBreadcrumbFinal: null,
    carritoEstaVacio: true,
    buscador: null,
    productoId: 0
}

const reducer = createReducer( 
    initialState, 
    on(SettingsActions.actionSettingsNombreBreadcrumb,
        (state, action) => ({...state, ...action}) ),
    on(SettingsActions.actionSettingsBreadcrumbExist,
        (state, {hayBreadcrumbFinal}) => ({...state, hayBreadcrumbFinal}) ),
    on(SettingsActions.actionSettingsIsAuthenticated,
            (state, {isAuthenticated}) => ({...state, isAuthenticated}) ),
    on(SettingsActions.actionSettingsCarritoVacio,
        (state, {carritoEstaVacio}) => ({...state, carritoEstaVacio}) ),
    on(SettingsActions.actionSettingsBuscador,
        (state, action) => ({...state, ...action}) ),
    on(SettingsActions.actionSettingsCambiarProductoId,
        (state, action) => ({...state, ...action}) ),
)

export function settingsReducer(
    state: SettingsState | undefined,
    action: Action
){
    return reducer(state, action);
}