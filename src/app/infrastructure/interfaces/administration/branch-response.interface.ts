import { serviceResponse } from './service-response.interface';

export interface brachResponse {
  id: number;
  name: string;
  services: serviceResponse[];
}
