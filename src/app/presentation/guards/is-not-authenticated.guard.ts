import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const isNotAuthenticatedGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  if (localStorage.getItem('token')) {
    router.navigateByUrl('/administration');
    return false;
  }
  return true;
};