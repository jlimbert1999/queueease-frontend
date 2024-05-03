export interface serviceResponse {
  id: number;
  name: string;
  category?: category;
}
interface category {
  id: number;
  name: string;
}
