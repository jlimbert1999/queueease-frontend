import { brachResponse } from '../../../infrastructure/interfaces';

export interface serviceProps {
  id: number;
  name: string;
}
export class Branch {
  static fromResponse(response: brachResponse) {
    return new Branch(response.id, response.name, response.services);
  }
  constructor(
    public id: number,
    public name: string,
    public services: serviceProps[]
  ) {}
}
