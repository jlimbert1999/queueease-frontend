import { serviceRequestResponse } from '../../infrastructure/interfaces';
import { RequestStatus } from '../enum/request-status.enum';

interface serviceRequestProps {
  id: string;
  code: string;
  createdAt: Date;
  priority: number;
  status: RequestStatus;
  branchId: string;
}

export class ServiceRequest {
  id: string;
  code: string;
  createdAt: Date;
  priority: number;
  status: RequestStatus;
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
