import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConfigService } from '../services';

export const branchConfigGuard: CanActivateFn = () => {
  const configService = inject(ConfigService);
  const messageService = inject(MessageService);
  const router = inject(Router);
  if (!configService.branch()) {
    messageService.add({
      summary: 'Sin configuracion',
      severity: 'secondary',
      detail: 'Configure la sucursal para acceder',
      life: 4000,
    });
    router.navigate(['main']);
    return false;
  }
  return true;
};
