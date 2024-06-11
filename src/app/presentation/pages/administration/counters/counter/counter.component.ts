import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  BranchService,
  CounterService,
  UserService,
} from '../../../../services';

import { serviceResponse } from '../../../../../infrastructure/interfaces';
import { DropdownComponent, SelectOption } from '../../../../components';
import { PrimengModule } from '../../../../../primeng.module';
import { minLengthArray } from '../../../../../helpers';
import { Counter } from '../../../../../domain/models';

@Component({
  selector: 'service-desk',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimengModule,
    DropdownComponent,
  ],
  templateUrl: './counter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private branchService = inject(BranchService);
  private userService = inject(UserService);
  private counterService = inject(CounterService);
  counter: Counter | undefined = inject(DynamicDialogConfig).data;

  branches = signal<SelectOption<string>[]>([]);
  users = signal<SelectOption<string>[]>([]);
  services = signal<serviceResponse[]>([]);

  FormDesk: FormGroup = this.fb.nonNullable.group({
    user: [null],
    name: ['', Validators.required],
    number: ['', Validators.required],
    branch: ['', Validators.required],
    services: ['', [Validators.required, minLengthArray(1)]],
  });

  constructor() {
    console.log(this.counter);
  }

  ngOnInit(): void {
    this._loadFormData();
  }

  save() {
    const subscription = this.counter
      ? this.counterService.update(this.counter.id, this.FormDesk.value)
      : this.counterService.create(this.FormDesk.value);
    subscription.subscribe((resp) => this.ref.close(resp));
  }

  searchBranch(value: string) {
    this.branchService.searchAvaibles(value).subscribe((branches) => {
      this.branches.set(
        branches.map(({ name, id }) => ({ label: name, value: id }))
      );
    });
  }

  selectBranch(id?: string) {
    if (!id) return;
    this.FormDesk.get('branch')?.setValue(id);
    this._getBranchServices(id);
  }

  searchUser(value: string) {
    this.userService.searchForAssign(value).subscribe((users) => {
      this.users.set(
        users.map(({ id, fullname }) => ({ label: fullname, value: id }))
      );
    });
  }

  selectUser(id: string ) {
    this.FormDesk.get('user')?.setValue(id);
  }

  private _loadFormData() {
    if (!this.counter) return;
    const { services, user, branch, ...props } = this.counter;
    this._getBranchServices(branch.id);
    this.FormDesk.removeControl('branch');
    this.FormDesk.patchValue({
      ...props,
      user: user?.id,
      services: services.map(({ id }) => id),
    });
    this.users.set([...(user ? [{ label: user.fullname, value: user.id }] : [])]);
  }

  private _getBranchServices(id: string) {
    this.branchService
      .getBranchServices(id)
      .subscribe((services) => this.services.set(services));
  }
}
