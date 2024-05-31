import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToolbarComponent } from '../../components';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ToolbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  items: MenuItem[] = [
    {
      label: 'Administracion',
      icon: 'pi pi-fw pi-box',
    },
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
      routerLink: 'desks',
    },
    {
      icon: 'pi pi-users',
      label: 'Usuarios',
      routerLink: 'users',
    },
  ];
}
