import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SecureUrlPipe } from '../../../../pipes/secure-url.pipe';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    SecureUrlPipe,
  ],
  templateUrl: './publications.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationsComponent {
  platforms = ['YouTube', 'Facebook', 'Dailymotion'];
  selectedPlatform: string = '';

  url = signal<string>('');

  buildSecureurl() {
    console.log(this.url);
    if (this.selectedPlatform === 'YouTube') {
      const id = this.extractYouTubeVideoId(this.url());
      console.log(id);
      this.url.set(
        `https://www.youtube.com/embed/${id}?autoplay=1&playlist=${id}&loop=1&muted=0&controls=0`
      );
      return;
    }
    if (this.selectedPlatform === 'Facebook') {
      this.url.set('');
      return;
    }
    if (this.selectedPlatform === 'Dailymotion') {
      this.url.set('');
      return;
    }
    return '';
  }

   extractYouTubeVideoId(url: string): string | null {
    console.log(url);
    const youtubePatterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)?([^&=\n%\?]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&=\n%\?]+)/
    ];
  
    for (const pattern of youtubePatterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  }
}
