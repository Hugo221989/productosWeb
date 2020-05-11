import { createSelector, createFeatureSelector } from "@ngrx/store";
import { SettingsState } from "./settings.model";

export const selectSettingsMemorized = createFeatureSelector<SettingsState>('settingsState');

export const selectSettingsHayBreadcrumb = createSelector(
    selectSettingsMemorized,
    (state: SettingsState) => state.hayBreadcrumbFinal
)

export const selectSettingsNombreBreadcrumb = createSelector(
    selectSettingsMemorized,
    (state: SettingsState) => state.nombreBreadcrumbFinal
)

export const selectSettingsIsAuthenticated = createSelector(
    selectSettingsMemorized,
    (state: SettingsState) => state.isAuthenticated
)

export const selectSettingsCarritoEstaVacio = createSelector(
    selectSettingsMemorized,
    (state: SettingsState) => state.carritoEstaVacio
)

export const selectSettingsBuscador = createSelector(
    selectSettingsMemorized,
    (state: SettingsState) => state.buscador
)