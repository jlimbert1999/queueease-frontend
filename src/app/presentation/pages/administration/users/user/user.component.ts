import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { PrimengModule } from '../../../../../primeng.module';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, PrimengModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent {
  private fb = inject(FormBuilder);

  FormBranch: FormGroup = this.fb.group({
    login: ['', Validators.required],
    fullname: ['', Validators.required],
    password: ['', Validators.required],
    marqueeMessage: ['', Validators.required],
  });
}
