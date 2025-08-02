import { CanActivateFn } from '@angular/router';

export const hostGuardGuard: CanActivateFn = (route, state) => {
  return true;
};
