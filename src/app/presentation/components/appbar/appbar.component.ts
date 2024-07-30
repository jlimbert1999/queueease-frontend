import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ProfileComponent } from '../profile/profile.component';
import { AuthService } from '../../services';

@Component({
  selector: 'app-appbar',
  standalone: true,
  imports: [CommonModule, ProfileComponent, MenubarModule],
  templateUrl: './appbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppbarComponent {
  private authService = inject(AuthService);
  items = this.authService.menu();
}
