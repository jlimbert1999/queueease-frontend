interface branchProps {
  name: string;
  services: string[];
  videos: string[];
  marqueeMessage: string;
}

export class CreateBranchDto {
  name: string;
  services: string[];
  videos: string[];
  marqueeMessage: string;

  static fromForm(form: any, services: string[], videos: string[]) {
    return new CreateBranchDto({
      name: form['name'],
      marqueeMessage: form['marqueeMessage'],
      videos: videos,
      services: services,
    });
  }
  
  constructor({ name, services, videos, marqueeMessage }: branchProps) {
    this.name = name;
    this.services = services;
    this.videos = videos;
    this.marqueeMessage = marqueeMessage;
  }
}
