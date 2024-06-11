import { counterResponse } from '../../../infrastructure/interfaces';

interface counterProps {
  id: number;
  name: string;
  number: number;
  branch: branch;
  services: service[];
  user?: user;
}

interface service {
  id: string;
  name: string;
}
interface branch {
  id: string;
  name: string;
}
interface user {
  id: string;
  fullname: string;
}
export class Counter {
  id: number;
  name: string;
  number: number;
  branch: branch;
  services: service[];
  user?: user;

  static fromResponse(response: counterResponse) {
    return new Counter({
      id: response.id,
      name: response.name,
      number: response.number,
      branch: response.branch,
      user: response.user,
      services: response.services.map(({ id, name }) => ({ id, name })),
    });
  }

  constructor({ id, name, number, branch, services, user }: counterProps) {
    this.id = id;
    this.name = name;
    this.number = number;
    this.branch = branch;
    this.services = services;
    this.user = user;
  }
}
