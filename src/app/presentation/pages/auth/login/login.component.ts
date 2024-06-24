import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PrimengModule } from '../../../../primeng.module';
import { AuthService } from '../../../services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, PrimengModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  LoginForm = this.fb.nonNullable.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
  });

  login() {
    const { login, password } = this.LoginForm.value;
    this.authService.login(login!, password!).subscribe((url) => {
      this.router.navigateByUrl(url);
    });
  }
}
