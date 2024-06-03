import { serviceResponse } from './service-response.interface';

export interface brachResponse {
  id: number;
  name: string;
  videoUrl?: string;
  videoPlatform?: string;
  marqueeMessage?: string;
  services: serviceResponse[];
}
