import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PrimengModule } from '../../../primeng.module';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './information.component.html',
  styleUrl: './information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationComponent {
  mnu: MenuItem[] = [
    {
      label: 'Finder',
      styleClass: 'menubar-root',
     
    },
  ];
}
