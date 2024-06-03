export class CreateBranchDto {
  static fromForm(name: string, services: string[]) {
    return new CreateBranchDto(name, services);
  }
  constructor(public name: string, public services: string[]) {}
}
