import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-background',
  standalone: true,
  imports: [],
  templateUrl: './background.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundComponent {}
