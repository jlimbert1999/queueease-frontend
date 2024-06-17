import { brachResponse } from './branch-response.interface';
import { serviceResponse } from './service-response.interface';

export interface counterResponse {
  id: number;
  ip: string;
  number: number;
  branch: brachResponse;
  services: serviceResponse[];
}
