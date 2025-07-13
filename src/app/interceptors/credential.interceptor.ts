import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
const PUBLIC_API_DOMAINS = [
  'nominatim.openstreetmap.org',
];
export function credentialsInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const isPublicApi = PUBLIC_API_DOMAINS.some(domain => req.url.includes(domain));
  if (!isPublicApi) {
    req = req.clone({ withCredentials: true });
  }
  return next(req);
}
