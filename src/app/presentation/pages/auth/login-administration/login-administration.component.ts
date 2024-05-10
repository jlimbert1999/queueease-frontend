import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-login-administration',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './login-administration.component.html',
  styleUrl: './login-administration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginAdministrationComponent { }
