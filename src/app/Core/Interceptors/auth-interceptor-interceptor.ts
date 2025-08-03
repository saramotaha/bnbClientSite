import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('access_token');
  console.log(token);
  // Get token from storage

  if (token) {
    // Clone the request and add the Authorization header
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq); // Send cloned request with token
  }

  // If no token, just send the original request
  return next(req);
  // return next(req);
};
