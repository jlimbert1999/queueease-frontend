import { serviceRequestResponse } from '../../infrastructure/interfaces';
import { RequestStatus } from '../enum/request-status.enum';

interface serviceRequestProps {
  id: string;
  code: string;
  createdAt: Date;
  priority: number;
  status: RequestStatus;
  service: serviceProps;
}

interface serviceProps {
  name: string;
}

export class ServiceRequest {
  id: string;
  code: string;
  createdAt: Date;
  priority: number;
  service: serviceProps;
  status: RequestStatus;

  static fromResponse({
    id,
    priority,
    code,
    createdAt,
    status,
    service,
  }: serviceRequestResponse) {
    return new ServiceRequest({
      id: id,
      priority: priority,
      code: code,
      createdAt: new Date(createdAt),
      status: status,
      service: service,
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
