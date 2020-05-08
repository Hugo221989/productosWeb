import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectSettingsIsAuthenticated } from '../settings/settings.selectors';
import { SettingsState } from '../settings/settings.model';
import { actionSettingsIsAuthenticated } from '../settings/settings.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private store: Store<{settings: SettingsState}>) {}

  activeSession: boolean = true;

  canActivate(): Observable<boolean> {
    if(window.sessionStorage.getItem('authenticated') == 'true'){
      this.store.dispatch(actionSettingsIsAuthenticated({
        isAuthenticated: true
      }))
    }
    return this.store.pipe(select(selectSettingsIsAuthenticated));
  }
}
