import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
/**
 * If the user is a guest (email == null), add userId as a query parameter to the request
 */
export function guestInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const userService = inject(UserService);
  const user = userService.user();
  if (user && ('email' in user) && user.email==null) {
    const cloned = req.clone({
      setParams: { userId: user.id },
    });
    return next(cloned);
  }
  return next(req);
}
