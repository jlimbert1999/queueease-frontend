import { RequestStatus } from '../../../domain/enum/request-status.enum';
import { serviceResponse } from '../administration/service-response.interface';

export interface serviceRequestResponse {
  id: string;
  priority: number;
  code: string;
  createdAt: Date;
  status: RequestStatus;
  service: serviceResponse;
}
