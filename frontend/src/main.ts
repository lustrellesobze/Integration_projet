import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { FormsModule } from '@angular/forms';
import { importProvidersFrom } from '@angular/core';

// ---- Vider le localStorage au démarrage ----
localStorage.clear();
// sessionStorage.clear(); // si tu préfères vider le sessionStorage

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    importProvidersFrom(FormsModule)
  ]
})
  .catch((err) => console.error(err));
