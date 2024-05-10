export interface serviceResponse {
  id: number;
  name: string;
  code: string;
  category?: category;
}
interface category {
  id: number;
  name: string;
}
