export interface reportServiceUserResponse {
  service: string;
  total: number;
  users: user[];
}

export interface user {
  name: string;
  total: number;
}
