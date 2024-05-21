import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { menuResponse } from '../../../infrastructure/interfaces';
import { PrimengModule } from '../../../primeng.module';

@Component({
  selector: 'grid-options',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './grid-options.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridOptionsComponent {
  elements = input<menuResponse[]>([]);
  onSelect = output<menuResponse>();

  select(item: menuResponse) {
    this.onSelect.emit(item);
  }
}
