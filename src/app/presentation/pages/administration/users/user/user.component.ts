import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { PrimengModule } from '../../../../../primeng.module';
import { userResponse } from '../../../../../infrastructure/interfaces';
import { UserService } from '../../../../services';
import { CustomFormValidators } from '../../../../../helpers';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, PrimengModule, ReactiveFormsModule, CheckboxModule],
  templateUrl: './user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private userService = inject(UserService);

  user: userResponse | undefined = inject(DynamicDialogConfig).data;
  readonly roles = [
    { label: 'Usuario', value: 'officer' },
    { label: 'Administrador', value: 'admin' },
  ];

  updatePassword = signal<boolean>(false);

  FormUser: FormGroup = this.fb.group({
    fullname: ['', Validators.required],
    login: ['', Validators.required],
    password: ['', Validators.required],
    roles: [
      ['officer'],
      [Validators.required, CustomFormValidators.minLengthArray(1)],
    ],
  });

  constructor() {
    effect(() => {
      if (this.updatePassword()) return this.FormUser.removeControl('password');
      this.FormUser.addControl(
        'password',
        new FormControl('', Validators.required)
      );
    });
  }

  ngOnInit(): void {
    this._loadFormData();
  }

  save() {
    const subscription = this.user
      ? this.userService.update(this.user.id, this.FormUser.value)
      : this.userService.create(this.FormUser.value);
    subscription.subscribe((resp) => this.ref.close(resp));
  }

  togglePassword() {
    this.updatePassword.update((value) => !value);
  }

  private _loadFormData(): void {
    if (!this.user) return;
    this.updatePassword.set(true);
    this.FormUser.patchValue(this.user);
  }
}
