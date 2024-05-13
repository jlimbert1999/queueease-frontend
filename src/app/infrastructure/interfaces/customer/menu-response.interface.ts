export interface menuResponse {
  value: number | null;
  name: string;
  services: Service[];
}

export interface Service {
  value: number;
  name: string;
}
