export interface branchConfigResponse {
  id: string;
  name: string;
  message: string;
  menu: menuResponse[];
  videos: string[];
  preferences: preferece[];
  alertVideoUrl: string | undefined;
}

export interface menuResponse {
  value?: string;
  name: string;
  services: menuResponse[];
}

interface preferece {
  id: number;
  name: string;
}
