import { serviceDeskResponse } from '../../../infrastructure/interfaces';

interface service {
  id: string;
  name: string;
}
interface branch {
  id: number;
  name: string;
}
interface serviceDeskProps {
  id: number;
  name: string;
  number: number;
  branch: branch;
  services: service[];
}

export class ServiceDesk {
  id: number;
  name: string;
  number: number;
  branch: branch;
  services: service[];

  static fromResponse(response: serviceDeskResponse) {
    return new ServiceDesk({
      id: response.id,
      name: response.name,
      number: response.number,
      branch: response.branch,
      services: response.services.map(({ id, name }) => ({ id, name })),
    });
  }

  constructor({ id, name, number, branch, services }: serviceDeskProps) {
    this.id = id;
    this.name = name;
    this.number = number;
    this.branch = branch;
    this.services = services;
  }
}
