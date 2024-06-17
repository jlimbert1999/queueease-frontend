import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { ServiceDeskService } from '../services';

export const counterGuard: CanActivateFn = () => {
  const serviceDeskService = inject(ServiceDeskService);
  const router = inject(Router);
  return serviceDeskService.getCounterDetails();
};
