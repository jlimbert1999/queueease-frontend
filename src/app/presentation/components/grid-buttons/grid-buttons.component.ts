import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { menuResponse } from '../../../infrastructure/interfaces';
import { PrimengModule } from '../../../primeng.module';

@Component({
  selector: 'grid-buttons',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './grid-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridButtonsComponent {
  elements = input<menuResponse[]>([]);
  onSelect = output<menuResponse>();

  select(item: menuResponse) {
    this.onSelect.emit(item);
  }
}
