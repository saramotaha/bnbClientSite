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

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/unauthorized']);
    return of(false);
  }

  const user = authService.getUserProfile();
  const requiredRoles: string[] = route.data['roles'] || (route.data['requiredRole'] ? [route.data['requiredRole']] : []);

  // Validate user and role data
  if (!user || !user.role || !Array.isArray(user.role)) {
    router.navigate(['/unauthorized']);
    return of(false);
  }

  const userRoles = user.role.map((r: string) => r.toLowerCase());
  const requiredRoles_lower = requiredRoles.map((r) => r.toLowerCase());

  console.log('🔍 Guard Debug Info:');
  console.log('User object:', user);
  console.log('User roles:', userRoles);
  console.log('Required roles:', requiredRoles_lower);
  console.log('Current route:', state.url);
  console.log('Route data:', route.data);
  console.log('Is authenticated:', authService.isAuthenticated());
  console.log('User ID:', authService.getUserId());

  // If no specific roles are required, just check authentication and account status
  if (requiredRoles.length === 0) {
    return checkUserAccountStatus(userManage, authService, router);
  }

  // ✅ ADMIN ACCESS: Admins can access all routes (including admin-specific ones)
  if (userRoles.includes('admin')) {
    // For admins, we might want to skip email verification or handle it differently
    return checkAdminAccountStatus(userManage, authService, router);
  }

  // ✅ HOST ACCESS: Check if user has host role when host is required
  if (requiredRoles_lower.includes('host')) {
    if (!userRoles.includes('host')) {
      if (userRoles.includes('guest')) {
        // Guest trying to access host route → redirect to host application
        router.navigate(['/HostApplication']);
      } else {
        // Non-guest, non-host user → unauthorized
        router.navigate(['/unauthorized']);
      }
      return of(false);
    }
    
    // User has host role, now check if host is verified
    return checkHostVerificationAndAccountStatus(userManage, authService, router);
  }

  // ✅ GUEST ACCESS: Check if user has guest role when guest is required
  if (requiredRoles_lower.includes('guest')) {
    if (!userRoles.includes('guest')) {
      router.navigate(['/unauthorized']);
      return of(false);
    }
    return checkUserAccountStatus(userManage, authService, router);
  }

  // ✅ ROLE MATCHING: Check if user has any of the required roles
  const hasRequiredRole = requiredRoles_lower.some(role => userRoles.includes(role));
  
  if (!hasRequiredRole) {
    router.navigate(['/unauthorized']);
    return of(false);
  }

  // User has required role, check account status
  return checkUserAccountStatus(userManage, authService, router);
};

// Helper function to check admin account status (bypass all checks)
function checkAdminAccountStatus(
  userManage: UserManagementService, 
  authService: AuthService, 
  router: Router
): Observable<boolean> {
  console.log('✅ Admin access granted - bypassing email verification and account status checks');
  return of(true);
}

// Helper function to check user account status
function checkUserAccountStatus(
  userManage: UserManagementService, 
  authService: AuthService, 
  router: Router
): Observable<boolean> {
  return userManage.GetUserData(Number(authService.getUserId())).pipe(
    map((data: any) => {
      if (!data.emailVerified || data.accountStatus !== 'Active') {
        console.log('❌ Account verification failed:', { emailVerified: data.emailVerified, accountStatus: data.accountStatus });
        router.navigate(['/unauthorized']);
        return false;
      }
      console.log('✅ Account verification passed');
      return true;
    }),
    catchError((error) => {
      console.error('❌ Error checking user account status:', error);
      router.navigate(['/unauthorized']);
      return of(false);
    })
  );
}

// Helper function to check host verification and account status
function checkHostVerificationAndAccountStatus(
  userManage: UserManagementService, 
  authService: AuthService, 
  router: Router
): Observable<boolean> {
  return userManage.GetUserData(Number(authService.getUserId())).pipe(
    switchMap((data: any) => {
      if (!data.emailVerified || data.accountStatus !== 'Active') {
        console.log('❌ Account verification failed:', { emailVerified: data.emailVerified, accountStatus: data.accountStatus });
        router.navigate(['/unauthorized']);
        return of(false);
      }

      // Check host verification
      return authService.getHostVerified().pipe(
        map((isVerified: boolean) => {
          if (!isVerified) {
            console.log('❌ Host verification failed');
            router.navigate(['/unauthorized']);
            return false;
          }
          console.log('✅ Host verification passed');
          return true;
        }),
        catchError((error) => {
          console.error('❌ Error checking host verification:', error);
          router.navigate(['/unauthorized']);
          return of(false);
        })
      );
    }),
    catchError((error) => {
      console.error('❌ Error checking user account status:', error);
      router.navigate(['/unauthorized']);
      return of(false);
    })
  );
}