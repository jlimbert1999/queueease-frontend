interface userProps {
  fullname: string;
  login: string;
  password: string;
  roles: string;
  isActive: boolean;
}
export class CreateUserDto {
  fullname: string;
  login: string;
  password: string;
  roles: string;
  isActive: boolean;

  static fromForm(form: any) {
    return new CreateUserDto({
      fullname: form['fullname'],
      login: form['login'],
      password: form['password'],
      roles: form['roles'],
      isActive: form['isActive'],
    });
  }
  constructor({ fullname, login, password, roles, isActive }: userProps) {
    this.fullname = fullname;
    this.login = login;
    this.password = password;
    this.roles = roles;
    this.isActive = isActive;
  }
}
