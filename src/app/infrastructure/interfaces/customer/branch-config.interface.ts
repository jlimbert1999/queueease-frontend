export interface branchConfigResponse {
  id: string;
  name: string;
  message: string;
  menu: menuResponse[];
  videos: string[];
}

export interface menuResponse {
  value?: string;
  name: string;
  services: menuResponse[];
}

