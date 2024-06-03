import { serviceResponse } from './service-response.interface';

export interface brachResponse {
  id: string;
  name: string;
  videoUrl?: string;
  videoPlatform?: string;
  marqueeMessage?: string;
  services: serviceResponse[];
}
