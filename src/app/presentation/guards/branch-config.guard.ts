import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { tap } from 'rxjs';
import { AlertService, CustomerService } from '../services';

export const branchConfigGuard: CanActivateFn = () => {
  const customerService = inject(CustomerService);
  const alertService = inject(AlertService);
  const router = inject(Router);
  return customerService.chechBranchConfig().pipe(
    tap((isConfig) => {
      if (!isConfig) {
        alertService.show({
          header: 'Sin configuracion',
          description: 'Seleccione una sucursal para continuar.',
        });
        localStorage.removeItem('branch')
        router.navigateByUrl('/dashboard');
      }
    })
  );
};
