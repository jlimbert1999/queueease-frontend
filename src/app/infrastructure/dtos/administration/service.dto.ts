export class ServiceDto {
  static fromForm(form: any) {
    return new ServiceDto(form['name'], form['code'], form['category']);
  }
  constructor(
    public name: string,
    public code: string,
    public category?: number
  ) {}
}
