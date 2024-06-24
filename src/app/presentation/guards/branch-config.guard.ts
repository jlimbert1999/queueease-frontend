import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AlertService, ConfigService } from '../services';

export const branchConfigGuard: CanActivateFn = () => {
  const configService = inject(ConfigService);
  const alertService = inject(AlertService);
  const router = inject(Router);
  if (!configService.branch()) {
    alertService.show({
      header: 'Sin configuracion',
      description: 'Seleccione una sucursal para acceder.',
    });
    router.navigateByUrl('/dashboard');
    return false;
  }
  return true;
};
