import * as SettingsActions from '../settings/settings.actions';
import { createReducer, on, Action } from '@ngrx/store';
import { SettingsState } from '../settings/settings.model';
import { Cesta } from '../models/cesta';


export const initialState: SettingsState = {
    isAuthenticated: false,
    hayBreadcrumbFinal: false,
    nombreBreadcrumbFinal: null,
    nombreBreadcrumbFinalEng: null,
    carritoEstaVacio: true,
    cesta: null,
    buscador: null,
    productoId: 0,
    language: 0
}

const reducer = createReducer( 
    initialState, 
    on(SettingsActions.actionSettingsNombreBreadcrumb,
        (state, action) => ({...state, ...action}) ),
    on(SettingsActions.actionSettingsNombreBreadcrumbEng,
        (state, action) => ({...state, ...action}) ),
    on(SettingsActions.actionSettingsBreadcrumbExist,
        (state, {hayBreadcrumbFinal}) => ({...state, hayBreadcrumbFinal}) ),
    on(SettingsActions.actionSettingsIsAuthenticated,
            (state, {isAuthenticated}) => ({...state, isAuthenticated}) ),
    on(SettingsActions.actionSettingsCarritoVacio,
        (state, {carritoEstaVacio}) => ({...state, carritoEstaVacio}) ),
    on(SettingsActions.actionSettingsCesta,
        (state, {cesta} ) => ({cesta: cesta})),
    on(SettingsActions.actionSettingsBuscador,
        (state, action) => ({...state, ...action}) ),
    on(SettingsActions.actionSettingsCambiarProductoId,
        (state, action) => ({...state, ...action}) ),
    on(SettingsActions.actionSettingsCambiarLanguage,
        (state, action) => ({...state, ...action}) ),
)

export function settingsReducer(
    state: SettingsState | undefined,
    action: Action
){
    return reducer(state, action);
}