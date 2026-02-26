import { ApplicationConfig, provideBrowserGlobalErrorListeners, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Observable, firstValueFrom } from 'rxjs';

import { routes } from './app.routes';

// Custom Translation Loader
export class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    // Add timestamp to prevent caching issues
    const timestamp = new Date().getTime();
    return this.http.get(`/assets/i18n/${lang}.json?v=${timestamp}`);
  }
}

// Translation loader factory
export function createTranslateLoader(http: HttpClient) {
  return new CustomTranslateLoader(http);
}

// Initialize translations before app starts
export function initializeTranslations(translate: TranslateService) {
  return () => {
    translate.setDefaultLang('en');
    const savedLang = localStorage.getItem('language') || 'en';
    return firstValueFrom(translate.use(savedLang));
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    })),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        }
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTranslations,
      deps: [TranslateService],
      multi: true
    }
  ]
};
