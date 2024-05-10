import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-login-service-desk',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './login-service-desk.component.html',
  styleUrl: './login-service-desk.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginServiceDeskComponent { }
