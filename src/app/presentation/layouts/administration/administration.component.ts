import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PrimengModule } from '../../../primeng.module';

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterModule, PrimengModule],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationComponent {
  items: MenuItem[] = [
    {
      label: 'Administracion',
      icon: 'pi pi-fw pi-box',
      items: [
        {
          label: 'Categorias',
          routerLink: 'categories',
        },
        {
          label: 'Servicios',
          routerLink: 'services',
        },
      ],
    },
  ];
}
