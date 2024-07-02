import { serviceRequestResponse } from '../../infrastructure/interfaces';
import { ServiceStatus } from '../enums/service-status.enum';

interface serviceRequestProps {
  id: string;
  code: string;
  createdAt: Date;
  priority: number;
  status: ServiceStatus;
  branchId: string;
}

export class ServiceRequest {
  id: string;
  code: string;
  createdAt: Date;
  priority: number;
  status: ServiceStatus;
  branchId: string;

  static fromResponse({
    id,
    priority,
    code,
    createdAt,
    status,
    branchId,
  }: serviceRequestResponse) {
    return new ServiceRequest({
      id: id,
      priority: priority,
      code: code,
      createdAt: new Date(createdAt),
      status: status,
      branchId: branchId,
    });
  }

  constructor({
    id,
    priority,
    code,
    createdAt,
    status,
    branchId,
  }: serviceRequestProps) {
    this.id = id;
    this.priority = priority;
    this.code = code;
    this.createdAt = createdAt;
    this.status = status;
    this.branchId = branchId;
  }

  get statusLabel(): string {
    switch (this.status) {
      case ServiceStatus.ABSENT:
        return 'AUSENTE';
      case ServiceStatus.ATTENDED:
        return 'ATENDIDO';
      case ServiceStatus.PENDING:
        return 'PENDIENTE';
      case ServiceStatus.SERVICING:
        return 'PENDIENTE';
      default:
        return 'DESCONOCIDO';
    }
  }
}
