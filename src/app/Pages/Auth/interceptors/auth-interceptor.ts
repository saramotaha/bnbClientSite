import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  // For API requests, add withCredentials
  if (req.url.startsWith('/api') || req.url.includes('localhost')) {
    const authReq = req.clone({
      withCredentials: true
    });
    return next(authReq);
  }
  return next(req);
};
