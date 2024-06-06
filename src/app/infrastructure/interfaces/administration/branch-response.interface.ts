import { serviceResponse } from './service-response.interface';

export interface brachResponse {
  id: string;
  name: string;
  services: serviceResponse[];
  videos: string[];
}
