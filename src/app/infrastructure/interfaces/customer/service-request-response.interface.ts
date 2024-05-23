import { RequestStatus } from '../../../domain/enum/request-status.enum';

export interface serviceRequestResponse {
  id: number;
  priority: number;
  code: string;
  date: string;
  status: RequestStatus;
  service: service;
}
interface service {
  name: string;
}
