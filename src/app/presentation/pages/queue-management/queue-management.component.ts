import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PrimengModule } from '../../../primeng.module';
import { ProfileComponent } from '../../components';
import { AuthService, ServiceDeskService, SocketService } from '../../services';

@Component({
  selector: 'app-queue-management',
  standalone: true,
  imports: [CommonModule, PrimengModule, ProfileComponent],
  templateUrl: './queue-management.component.html',
  styleUrl: './queue-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueManagementComponent implements OnInit {
  private authService = inject(AuthService);
  private socketSrevice = inject(SocketService);
  private serviceDeksService = inject(ServiceDeskService);
  items: MenuItem[] = [];

  requests = signal<any[]>([]);
  ngOnInit(): void {
    this.socketSrevice.listenServiceRequests().subscribe((resp) => {
      this.requests.update((val) => [resp, ...val]);
    });
    this.getRequests();
  }

  getRequests() {
    this.serviceDeksService.getServiceRequests().subscribe((data) => {
      console.log(data);
      this.requests.set(data);
    });
  }

  next() {
    this.serviceDeksService.nextRequest().subscribe((data) => {
      console.log(data);
    });
  }
}
