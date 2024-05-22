import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../presentation/services';

interface handlerProps {
  error: HttpErrorResponse;
  router: Router;
  messageService: MessageService;
  authService: AuthService;
}
export function handleHttpErrorMessage({
  error,
  router,
  authService,
  messageService,
}: handlerProps) {
  switch (error.status) {
    case 401:
      authService.logout();
      router.navigate(['/login']);
      break;

    case 500:
      messageService.add({
        severity: 'error',
        summary: 'Error interno',
        detail: 'Se ha producido un error en el servidor',
        life: 3000,
      });
      break;

    case 404:
      messageService.add({
        severity: 'info',
        summary: 'Recurso no encontrado',
        detail: 'El recurso solicitado no existe',
        life: 3000,
      });
      break;

    case 403:
      messageService.add({
        severity: 'contrast',
        summary: 'Acceso denegado',
        detail: error.error['message'],
        life: 3000,
      });
      break;

    default:
      messageService.add({
        severity: 'warn',
        summary: 'Solicitud incorrecta',
        detail: error.error['message'],
        life: 3000,
      });
      break;
  }
}
