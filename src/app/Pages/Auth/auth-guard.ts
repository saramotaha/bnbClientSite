import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state):Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/unauthorized']);
    return of(false);
  }

  const user = authService.getUserProfile();
  const requiredRoles: string[] = route.data['roles'];

  if (!user || !user.role || !Array.isArray(user.role)) {
    router.navigate(['/unauthorized']);
    return of(false);
  }

  const hasRole = requiredRoles.some(role =>
    user.role.includes(role.toLowerCase())
  );

  if (!hasRole) {
    router.navigate(['/unauthorized']);
    return of(false);
  }

  // 👇 Extra check if role is "host"
  if (user.role.includes('host') && requiredRoles.includes('host')) {
    return authService.getHostVerificationStatus().pipe(
      map(isVerified => {
        if (!isVerified) {
          router.navigate   (['/unauthorized']);
          return false;
        }
        return true;
      }),
      catchError(() => {
        router.navigate(['/unauthorized']);
        return of(false);
      })
    );
  }

  return of(true);
  };
