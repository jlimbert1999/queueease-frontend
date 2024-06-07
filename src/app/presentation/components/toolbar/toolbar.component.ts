import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ProfileComponent } from '../profile/profile.component';
import { LayoutService } from '../../services/app.layout.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, ProfileComponent, MenubarModule],
  templateUrl: './toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  items: MenuItem[] = [
    {
      icon: 'pi pi-th-large',
      label: 'Categorias',
      routerLink: 'categories',
    },
    {
      icon: 'pi pi-list-check',
      label: 'Servicios',
      routerLink: 'services',
    },
    {
      icon: 'pi pi-warehouse',
      label: 'Sucursales',
      routerLink: 'branches',
    },
    {
      icon: 'pi pi-shop',
      label: 'Ventanillas',
      routerLink: 'counters',
    },
    {
      icon: 'pi pi-users',
      label: 'Usuarios',
      routerLink: 'users',
    },
  ];
}
