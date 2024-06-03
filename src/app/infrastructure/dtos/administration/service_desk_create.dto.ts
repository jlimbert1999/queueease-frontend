interface serviveProps {
  name: string;
  number: number;
  branch: number;
  services: string[];
  login: string;
  password: string;
}
export class CreateServiceDeskDto {
  name: string;
  number: number;
  branch: number;
  services: string[];
  login: string;
  password: string;

  static fromForm(form: any, services: string[]) {
    return new CreateServiceDeskDto({
      name: form['name'],
      number: parseInt(form['number']),
      branch: form['branch'],
      services: services,
      login: form['login'],
      password: form['password'],
    });
  }
  constructor({
    name,
    number,
    branch,
    services,
    login,
    password,
  }: serviveProps) {
    this.name = name;
    this.number = number;
    this.branch = branch;
    this.services = services;
    this.login = login;
    this.password = password;
  }
}
