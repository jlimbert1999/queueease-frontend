import { serviceProps } from '../../../domain/models';

export class CreateBranchDto {
  static fromForm(name: string, services: serviceProps[]) {
    return new CreateBranchDto(
      name,
      services.map((el) => el.id)
    );
  }
  constructor(public name: string, public services: number[]) {}
}
