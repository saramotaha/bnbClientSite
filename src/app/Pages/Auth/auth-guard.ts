import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { UserManagementService } from '../../Admin/Services/user-management-service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const userManage = inject(UserManagementService);

  if (!authService.isAuthenticated()) {
    router.navigate(['/unauthorized']);
    return of(false);
  }

  const user = authService.getUserProfile();
  const requiredRoles: string[] = route.data['roles'] || [route.data['requiredRole']];
  if (!user || !user.role || !Array.isArray(user.role)) {
    router.navigate(['/unauthorized']);
    return of(false);
  }

  const roles = user.role.map((r: string) => r.toLowerCase());
  const requiredLower = requiredRoles.map((r) => r.toLowerCase());

  // 🧠 If admin accessing non-admin routes → unauthorized
  if (roles.includes('admin') && !requiredLower.includes('admin')) {
    router.navigate(['/unauthorized']);
    return of(false);
  }

  // ✅ If host is required but user doesn't have host role
  if (requiredLower.includes('host') && !roles.includes('host')) {
    if (roles.includes('guest')) {
      router.navigate(['/HostApplication']); // guest → redirect to host application page
    } else {
      router.navigate(['/unauthorized']); // not guest (e.g., admin) → unauthorized
    }
    return of(false);
  }

  // ✅ If role required is present, continue with account check
  return userManage.GetUserData(Number(authService.getUserId())).pipe(
    switchMap((data: any) => {
      if (!data.emailVerified || data.accountStatus !== 'Active') {
        router.navigate(['/unauthorized']);
        return of(false);
      }

      // If host is required → also check if host is verified
      if (requiredLower.includes('host')) {
        return authService.getHostVerified().pipe(
          map((isVerified: boolean) => {
            if (!isVerified) {
              router.navigate(['/unauthorized']);
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
    }),
    catchError(() => {
      router.navigate(['/unauthorized']);
      return of(false);
    })
  );
};
