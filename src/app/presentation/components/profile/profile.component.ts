import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PrimengModule } from '../../../primeng.module';
import { AuthService } from '../../services';

@Component({
  selector: 'profile',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  user = this.authService.user();
  avatarLabel = this.user?.fullname.trim()[0];
  items: MenuItem[] = [
    {
      label: 'Configuraciones',
      icon: 'pi pi-cog',
      route: '/guides/csslayer',
    },
    { separator: true },
    {
      label: 'Cerrar sesion',
      icon: 'pi pi-sign-out',
    },
  ];

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
