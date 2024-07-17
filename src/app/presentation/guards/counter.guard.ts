import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { tap } from 'rxjs';
import { AlertService, AttentionService } from '../services';

export const counterGuard: CanActivateFn = () => {
  const router = inject(Router);
  const alertService = inject(AlertService);
  const attentionService = inject(AttentionService);
  return attentionService.checkCounter().pipe(
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
