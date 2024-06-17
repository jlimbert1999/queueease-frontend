import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { ServiceDeskService } from '../services';

export const counterGuard: CanActivateFn = (route, state) => {
  const serviceDeskService = inject(ServiceDeskService);
  return serviceDeskService.getCounterDetails();
};
