import { Pipe, inject, type PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safe',
  standalone: true,
})
export class SecureUrlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);
  transform(url: string): unknown {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
