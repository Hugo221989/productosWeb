import * as SettingsActions from '../settings/settings.actions';
import { createReducer, on, Action } from '@ngrx/store';
import { SettingsState } from '../settings/settings.model';


export const initialState: SettingsState = {
    isAuthenticated: false,
    hayBreadcrumbFinal: false,
    nombreBreadcrumbFinal: null,
    carritoEstaVacio: true
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
        (state, {carritoEstaVacio}) => ({...state, carritoEstaVacio}) )
)

export function settingsReducer(
    state: SettingsState | undefined,
    action: Action
){
    return reducer(state, action);
}