import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { ServiceDeskService } from '../services';
import { tap } from 'rxjs';

export const counterGuard: CanActivateFn = () => {
  const serviceDeskService = inject(ServiceDeskService);
  const router = inject(Router);
  return serviceDeskService.getCounterDetails().pipe(tap(() => {}));
};
