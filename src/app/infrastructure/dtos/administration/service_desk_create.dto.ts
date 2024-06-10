interface serviveProps {
  name: string;
  number: number;
  branch: string;
  services: string[];
  user: string;
  login: string;
  password: string;
}
export class CreateServiceDeskDto {
  name: string;
  number: number;
  branch: string;
  user: string;
  services: string[];
  login: string;
  password: string;

  static fromForm(form: any) {
    return new CreateServiceDeskDto({
      name: form['name'],
      number: parseInt(form['number']),
      branch: form['branch'],
      services: form['services'],
      login: form['login'],
      password: form['password'],
      user: form['user'],
    });
  }
  constructor({
    name,
    number,
    branch,
    services,
    login,
    password,
    user,
  }: serviveProps) {
    this.name = name;
    this.number = number;
    this.branch = branch;
    this.services = services;
    this.login = login;
    this.password = password;
    this.user = user;
  }
}
