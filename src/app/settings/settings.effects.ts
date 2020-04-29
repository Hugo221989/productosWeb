import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { actionSettingsIsAuthenticated, actionSettingsNombreBreadcrumb } from "./settings.actions";
import { map, withLatestFrom, tap } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { SettingsState } from "./settings.model";
import { selectSettingsNombreBreadcrumb, selectSettingsIsAuthenticated } from './settings.selectors';


export const SETTINGS_KEY = 'settingsState';

@Injectable()
export class SettingsEffect{
    constructor(private actions$: Actions,
                private store: Store<{settings: SettingsState}>){

    }

    persistSettingsAuthenticated$ = createEffect(() => 
        this.actions$.pipe(
                ofType(actionSettingsIsAuthenticated),
                withLatestFrom(this.store.pipe(select(selectSettingsIsAuthenticated))),
                tap(([action, settings]) =>{
                    console.log(action.isAuthenticated)
                     localStorage.setItem('authenticated', JSON.stringify(settings))
                }
                )

                /** An EMPTY observable only emits completion. Replace with your own observable stream */
    ),{ dispatch: false }
    )


    persistSettingsProductName$ = createEffect(() => 
        this.actions$.pipe(
                ofType(actionSettingsNombreBreadcrumb),
                withLatestFrom(this.store.pipe(select(selectSettingsNombreBreadcrumb))),
                tap(([action, settings]) =>{
                console.log("NOMBRE: ",action.nombreBreadcrumbFinal )
                localStorage.setItem('nombreBreadcrumb', settings)
                }
                )

                /** An EMPTY observable only emits completion. Replace with your own observable stream */
    ),{ dispatch: false }
    )
}