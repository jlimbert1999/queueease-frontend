interface serviveProps {
  ip: string;
  number: number;
  branch: string;
  services: string[];
}
export class CreateServiceDeskDto {
  ip: string;
  number: number;
  branch: string;
  services: string[];

  static fromForm(form: any) {
    return new CreateServiceDeskDto({
      ip: form['ip'],
      number: parseInt(form['number']),
      branch: form['branch'],
      services: form['services'],
    });
  }
  constructor({ ip, number, branch, services }: serviveProps) {
    this.ip = ip;
    this.number = number;
    this.branch = branch;
    this.services = services;
  }
}
