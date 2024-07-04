import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AlertService, CustomerService } from '../services';
import { tap } from 'rxjs';

export const branchConfigGuard: CanActivateFn = () => {
  const customerService = inject(CustomerService);
  const alertService = inject(AlertService);
  const router = inject(Router);
  return customerService.chechBranchConfig().pipe(
    tap((isConfig) => {
      if (!isConfig) {
        alertService.show({
          header: 'Sin configuracion',
          description: 'Seleccione una sucursal para acceder.',
        });
        localStorage.removeItem('branch')
        router.navigateByUrl('/dashboard');
      }
    })
  );
};
