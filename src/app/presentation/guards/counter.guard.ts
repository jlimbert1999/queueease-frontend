import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AlertService, ServiceDeskService } from '../services';
import { tap } from 'rxjs';

export const counterGuard: CanActivateFn = () => {
  const router = inject(Router);
  const alertService = inject(AlertService);
  const serviceDeskService = inject(ServiceDeskService);
  return serviceDeskService.getCounterDetails().pipe(
    tap((isAllowed) => {
      if (!isAllowed) {
        alertService.show({
          header: 'Acceso Denegado',
          description:'Solo se puede acceder utilizando un dispositivo previamente autorizado.',
          icon:'security'
        });
        localStorage.removeItem('token');
        router.navigateByUrl('login');
      }
    })
  );
};
