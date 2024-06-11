import { brachResponse } from './branch-response.interface';
import { serviceResponse } from './service-response.interface';
import { userResponse } from './user-response.interface';

export interface counterResponse {
  id: number;
  name: string;
  number: number;
  branch: brachResponse;
  services: serviceResponse[];
  user?: userResponse;
}
