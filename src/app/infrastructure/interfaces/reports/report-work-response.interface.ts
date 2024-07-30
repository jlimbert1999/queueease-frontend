import { ServiceStatus } from "../../../domain";

export interface reportWorkResponse {
  service: string;
  details: detail[];
}

interface detail {
  status: ServiceStatus;
  total: string;
}
