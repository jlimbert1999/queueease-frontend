import { brachResponse } from './branch-response.interface';
import { serviceResponse } from './service-response.interface';

export interface serviceDeskResponse {
  id: number;
  name: string;
  number: number;
  branch: brachResponse;
  services: serviceResponse[];
}
