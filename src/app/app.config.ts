import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { loadingInterceptor } from './Core/Interceptors/loading-interceptor';
// import { authInterceptorFn } from './Pages/Auth/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([loadingInterceptor])
      // withInterceptors([authInterceptorFn]) // uncomment when needed
    ),
    provideCharts(withDefaultRegisterables()),
  ]
};
