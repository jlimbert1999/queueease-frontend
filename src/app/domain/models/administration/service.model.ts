import { serviceResponse } from '../../../infrastructure/interfaces';

interface serviceProps {
  id: string;
  name: string;
  code: string;
  category?: categoryProps;
}
interface categoryProps {
  id: number;
  name: string;
}
export class Service {
  id: string;
  name: string;
  code: string;
  category?: categoryProps;

  static fromResponse({ id, name, category, code }: serviceResponse) {
    return new Service({ id, name, category, code });
  }

  constructor({ id, name, code, category }: serviceProps) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.category = category;
  }

  get groupName() {
    return this.category ? this.category.name : '------';
  }
}
