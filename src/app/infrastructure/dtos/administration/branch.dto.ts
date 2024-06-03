interface branchProps {
  name: string;
  services: string[];
  videoUrl: string;
  videoPlatform: string;
  marqueeMessage: string;
}

export class CreateBranchDto {
  name: string;
  services: string[];
  videoUrl: string;
  videoPlatform: string;
  marqueeMessage: string;

  static fromForm(form: any, services: string[]) {
    return new CreateBranchDto({
      name: form['name'],
      services: services,
      videoUrl: form['videoUrl'],
      videoPlatform: form['videoPlatform'],
      marqueeMessage: form['marqueeMessage'],
    });
  }
  constructor({
    name,
    services,
    videoUrl,
    videoPlatform,
    marqueeMessage,
  }: branchProps) {
    this.name = name;
    this.services = services;
    this.videoUrl = videoUrl;
    this.videoPlatform = videoPlatform;
    this.marqueeMessage = marqueeMessage;
  }
}
