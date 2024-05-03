import { categoryResponse } from '../../../infrastructure/interfaces';

export class Category {
  static fromResponse(response: categoryResponse) {
    return new Category(response.id, response.name);
  }

  constructor(public id: number, public name: string) {}
}
