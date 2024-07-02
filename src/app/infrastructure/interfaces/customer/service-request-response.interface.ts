import { ServiceStatus } from '../../../domain/enums/service-status.enum';

export interface serviceRequestResponse {
  id: string;
  priority: number;
  code: string;
  createdAt: Date;
  status: ServiceStatus;
  branchId: string;
}
