// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only add withCredentials to API calls to your backend
    const isApiUrl = req.url.startsWith('https://localhost:7145');
    const authReq = isApiUrl ? req.clone({ withCredentials: true }) : req;
    return next.handle(authReq);
  }
}
