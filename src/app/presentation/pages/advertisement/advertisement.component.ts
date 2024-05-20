import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { SocketService } from '../../services';

@Component({
  selector: 'app-advertisement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './advertisement.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
  .marquee-container {
  width: 100%;
  overflow: hidden;
}

.marquee-text {
  white-space: nowrap;
  animation: marquee 30s linear infinite;
}

@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

  `,
})
export class AdvertisementComponent implements OnInit {
  list = signal<any[]>([]);
  private socketService = inject(SocketService);
  ngOnInit(): void {
    this.socketService.listenQueueEvent().subscribe((data) => {
      this.list.update((val) => [data, ...val]);
    });
  }
}
