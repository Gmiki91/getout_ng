import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();

   const isAuthRequest =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/refresh-token');
  // Add Authorization header if token exists and request is not an authorization request
  const cloned =
    accessToken && !isAuthRequest
      ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
      : req;

  return next(cloned).pipe(
    catchError((err) => {
      if (err.status === 401 && !isAuthRequest) {
        return authService.refreshToken().pipe(
          switchMap((newToken) => {
            return next(
              req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } })
            );
          }),
          catchError((refreshErr) => {
            authService.logout();
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => err);
    })
  );
}
