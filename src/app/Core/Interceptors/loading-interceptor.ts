import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../Services/loader-service';
import { finalize } from 'rxjs/operators';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const loadingService = inject(LoaderService)
  loadingService.show();
  return next(req).pipe(
    finalize(() => {

      loadingService.hide();

      }
    ))
};
