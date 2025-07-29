import { HttpInterceptorFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  // Clone request to add credentials
  const authReq = req.clone({
    withCredentials: true, // Required for cookies
    headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
  });

  return next(authReq).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        console.log('Login response cookies:', event.headers.getAll('Set-Cookie'));
      }
    })
  );
};