import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../Services/loader-service';
import { finalize } from 'rxjs/operators';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoaderService); // ✅ You must inject the service here
  console.log('[Interceptor] Request started:', req.url);

  // const loadingService = inject(LoaderService)
 queueMicrotask(() => loadingService.show());

  return next(req).pipe(
    finalize(() => {
        console.log('[Interceptor] Request edm:', req.url);

      queueMicrotask(() => loadingService.hide());
    })
  );

};
