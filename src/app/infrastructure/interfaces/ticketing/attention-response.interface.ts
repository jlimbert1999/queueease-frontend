import { serviceRequestResponse } from '../customer/service-request-response.interface';

export interface attentionResponse {
  serviceRequest: serviceRequestResponse;
  startTime: string;
  endTime: string | null;
}
