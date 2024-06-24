import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../services';

export const roleGuard: CanActivateFn = (route) => {
  const validRole = route.data['role'];
  if (!validRole) return true;
  const isAuthorized = inject(AuthService).roles().includes(validRole);
  if (!isAuthorized) {
    const router = inject(Router);
    router.navigateByUrl('/unauthorized');
    return false;
  }
  return true;
};
