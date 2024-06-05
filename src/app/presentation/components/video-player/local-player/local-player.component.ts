import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-local-player',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './local-player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocalPlayerComponent { }
