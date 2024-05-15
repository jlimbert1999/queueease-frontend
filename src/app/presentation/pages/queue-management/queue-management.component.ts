import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PrimengModule } from '../../../primeng.module';
import { AuthService } from '../../services';
import { MenuItem } from 'primeng/api';
import { ProfileComponent } from '../../components';

@Component({
  selector: 'app-queue-management',
  standalone: true,
  imports: [CommonModule, PrimengModule, ProfileComponent],
  templateUrl: './queue-management.component.html',
  styleUrl: './queue-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueManagementComponent {
  private authService = inject(AuthService);
  items: MenuItem[] = [];
}
