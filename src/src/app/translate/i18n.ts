import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export { AppServerModule } from './app/src/app/translate/i18n';
export { renderModule, renderModuleFactory } from '@angular/platform-server';
