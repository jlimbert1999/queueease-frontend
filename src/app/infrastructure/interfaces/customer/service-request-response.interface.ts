import { RequestStatus } from '../../../domain/enum/request-status.enum';

export interface serviceRequestResponse {
  id: string;
  priority: number;
  code: string;
  createdAt: Date;
  status: RequestStatus;
  branchId: string;
}
