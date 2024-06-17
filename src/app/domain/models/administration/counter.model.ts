import { counterResponse } from '../../../infrastructure/interfaces';

interface counterProps {
  id: number;
  ip: string;
  number: number;
  branch: branch;
  services: service[];
}

interface service {
  id: string;
  name: string;
}
interface branch {
  id: string;
  name: string;
}

export class Counter {
  id: number;
  ip: string;
  number: number;
  branch: branch;
  services: service[];

  static fromResponse(response: counterResponse) {
    return new Counter({
      id: response.id,
      ip: response.ip,
      number: response.number,
      branch: response.branch,
      services: response.services.map(({ id, name }) => ({ id, name })),
    });
  }

  constructor({ id, ip, number, branch, services }: counterProps) {
    this.id = id;
    this.ip = ip;
    this.number = number;
    this.branch = branch;
    this.services = services;
  }
}
