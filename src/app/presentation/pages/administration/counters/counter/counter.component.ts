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
import { BranchService, CounterService } from '../../../../services';

import {
  counterResponse,
  serviceResponse,
} from '../../../../../infrastructure/interfaces';
import { DropdownComponent, SelectOption } from '../../../../components';
import { PrimengModule } from '../../../../../primeng.module';
import { CustomFormValidators } from '../../../../../helpers';

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
  private counterService = inject(CounterService);
  counter: counterResponse | undefined = inject(DynamicDialogConfig).data;

  branches = signal<SelectOption<string>[]>([]);
  services = signal<serviceResponse[]>([]);

  FormDesk: FormGroup = this.fb.nonNullable.group({
    ip: ['', Validators.required],
    number: ['', Validators.required],
    branch: ['', Validators.required],
    services: [
      '',
      [Validators.required, CustomFormValidators.minLengthArray(1)],
    ],
  });

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

  selectUser(id: string) {
    this.FormDesk.get('user')?.setValue(id);
  }

  private _loadFormData() {
    if (!this.counter) return;
    const { services, branch, ...props } = this.counter;
    this._getBranchServices(branch.id);
    this.FormDesk.removeControl('branch');
    this.FormDesk.patchValue({
      ...props,
      services: services.map(({ id }) => id),
    });
  }

  private _getBranchServices(id: string) {
    this.branchService
      .getBranchServices(id)
      .subscribe((services) => this.services.set(services));
  }
}
