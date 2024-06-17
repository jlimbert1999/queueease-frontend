import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ProfileComponent } from '../profile/profile.component';
import { LayoutService } from '../../services/app.layout.service';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, ProfileComponent, MenubarModule],
  templateUrl: './toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  private authService = inject(AuthService);
  items = this.authService.menu();
}
