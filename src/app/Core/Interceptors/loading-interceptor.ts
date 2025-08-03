import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../Services/loader-service';
import { finalize } from 'rxjs/operators';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('🔄 Loading Interceptor triggered for:', req.url);
  
  const loadingService = inject(LoaderService);
  console.log('📊 Showing loader...');
  loadingService.show();
  
  return next(req).pipe(
    finalize(() => {
      console.log('✅ Request completed, hiding loader for:', req.url);
      loadingService.hide();
    })
  );
};
