import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SecureUrlPipe } from '../../../pipes/secure-url.pipe';

@Component({
  selector: 'app-youtube-player',
  standalone: true,
  imports: [CommonModule, SecureUrlPipe],
  templateUrl: './youtube-player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubePlayerComponent {
  url = input.required<string>();


}
