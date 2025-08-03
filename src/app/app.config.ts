import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
// import { provideHttpClient } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'; // ✅ add this
import { loadingInterceptor } from './Core/Interceptors/loading-interceptor';
import { authInterceptorInterceptor } from './Core/Interceptors/auth-interceptor-interceptor';
// import { authInterceptorFn } from './Pages/Auth/interceptors/auth-interceptor';





export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      // withInterceptors([authInterceptorFn]),
      // withFetch(),
      withInterceptors([authInterceptorInterceptor,loadingInterceptor])
    ),
    provideRouter(routes),
    // provideHttpClient(),
    provideCharts(withDefaultRegisterables()),
  ]
};
