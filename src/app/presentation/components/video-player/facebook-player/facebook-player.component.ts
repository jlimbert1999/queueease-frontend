import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SecureUrlPipe } from '../../../pipes/secure-url.pipe';

@Component({
  selector: 'app-facebook-player',
  standalone: true,
  imports: [CommonModule, SecureUrlPipe],
  templateUrl: './facebook-player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacebookPlayerComponent {
  url = input.required<string>();
}
