import { serviceResponse } from '../../../infrastructure/interfaces';

interface categoryProps {
  id: number;
  name: string;
}
export class Service {
  static fromResponse({ id, name, category }: serviceResponse) {
    return new Service(id, name, category);
  }
  constructor(
    public id: number,
    public name: string,
    public category?: categoryProps
  ) {}

  get groupName() {
    return this.category ? this.category.name : '------';
  }
}
