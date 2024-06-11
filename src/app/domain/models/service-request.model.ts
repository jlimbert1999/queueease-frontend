import { serviceRequestResponse } from '../../infrastructure/interfaces';
import { RequestStatus } from '../enum/request-status.enum';

interface serviceRequestProps {
  id: number;
  code: string;
  createdAt: Date;
  priority: number;
  service: Service;
  status: RequestStatus;
}

interface Service {
  name: string;
}

export class ServiceRequest {
  id: number;
  code: string;
  createdAt: Date;
  priority: number;
  service: Service;
  status: RequestStatus;

  static fromResponse(response: serviceRequestResponse) {
    return new ServiceRequest({
      id: response.id,
      priority: response.priority,
      code: response.code,
      createdAt: new Date(response.createdAt),
      status: response.status,
      service: response.service,
    });
  }

  constructor({
    id,
    priority,
    code,
    createdAt,
    status,
    service,
  }: serviceRequestProps) {
    this.id = id;
    this.priority = priority;
    this.code = code;
    this.createdAt = createdAt;
    this.status = status;
    this.service = service;
  }

  get statusLabel(): string {
    switch (this.status) {
      case RequestStatus.ABSENT:
        return 'AUSENTE';
      case RequestStatus.ATTENDED:
        return 'ATENDIDO';
      case RequestStatus.PENDING:
        return 'PENDIENTE';
      default:
        return 'EN ANTECION';
    }
  }
}
