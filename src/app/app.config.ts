import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
// import { provideHttpClient } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'; // ✅ add this
import { loadingInterceptor } from './Core/Interceptors/loading-interceptor';





export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptorFn]),
      withFetch()
    ),
    provideRouter(routes),
    provideHttpClient(withInterceptors([loadingInterceptor])),
    provideCharts(withDefaultRegisterables()),



    provideCharts(withDefaultRegisterables())
  ]
};
