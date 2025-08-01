import {  provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNgxSkeletonLoader } from 'ngx-skeleton-loader';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { credentialsInterceptor } from './interceptors/credential.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withFetch(), withInterceptors([authInterceptor,credentialsInterceptor])), 
    provideAnimationsAsync(),
    provideNgxSkeletonLoader()
  ]
};
