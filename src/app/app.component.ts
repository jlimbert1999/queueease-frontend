import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SocketService } from './presentation/services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService, MessageService],
})
export class AppComponent implements OnInit {
  title = 'queueease-front';
  private socketService = inject(SocketService);

  ngOnInit(): void {
    this.socketService.connect();
  }
  
}
