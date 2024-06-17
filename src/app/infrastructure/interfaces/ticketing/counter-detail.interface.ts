export interface counterDetail {
  id: string;
  services: service;
  branch: branch;
  number: number;
}

interface service {
  id: string;
  name: string;
}

interface branch {
  id: string;
}
