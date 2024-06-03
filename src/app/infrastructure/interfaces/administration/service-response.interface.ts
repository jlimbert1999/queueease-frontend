import { categoryResponse } from './category-response.interface';

export interface serviceResponse {
  id: string;
  name: string;
  code: string;
  category?: categoryResponse;
}
