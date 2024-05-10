import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  model,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BranchService, ServiceDeskService } from '../../../../services';
import {
  Branch,
  ServiceDesk,
  serviceProps,
} from '../../../../../domain/models';
import { PrimengModule } from '../../../../../primeng.module';

@Component({
  selector: 'service-desk',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PrimengModule],
  templateUrl: './service_desk.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceDeskComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private destroyRef = inject(DestroyRef);
  private branchService = inject(BranchService);
  private serviceDesk = inject(ServiceDeskService);
  private branch: ServiceDesk | undefined = inject(DynamicDialogConfig).data;

  desk: ServiceDesk | undefined = inject(DynamicDialogConfig).data;
  searchSubject$ = new Subject<string>();
  branches = signal<Branch[]>([]);
  services = model<serviceProps[]>([]);
  selectedServices = signal<serviceProps[]>([]);
  FormDesk: FormGroup = this.fb.nonNullable.group({
    name: ['', Validators.required],
    number: ['', Validators.required],
    branch: ['', Validators.required],
    login: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor() {}

  ngOnInit(): void {
    if (this.desk) {
      const { services, branch, ...props } = this.desk;
      this._getServicesByBranch(branch.id);
      this.FormDesk.removeControl('branch');
      this.FormDesk.patchValue(props);
      this.selectedServices.set(services);
    } else {
      this._observeChangesDrowpdown();
    }
  }

  onFilter(term?: string) {
    if (!term) return;
    this.searchSubject$.next(term);
  }

  onSelect(id: number) {
    this.selectedServices.set([]);
    this._getServicesByBranch(id);
  }

  save() {
    const subscription = this.branch
      ? this.serviceDesk.update(this.branch.id, {
          ...this.FormDesk.value,
          services: this.selectedServices().map((el) => el.id),
        })
      : this.serviceDesk.create(this.FormDesk.value, this.selectedServices());
    subscription.subscribe((resp) => this.ref.close(resp));
  }

  private _observeChangesDrowpdown() {
    this.searchSubject$
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(350))
      .subscribe((text) => this._searchBranch(text));
  }

  private _searchBranch(term: string) {
    this.branchService.searchAvaibles(term).subscribe((branches) => {
      this.branches.set(branches);
    });
  }

  private _getServicesByBranch(id: number) {
    this.branchService.getServicesByBranch(id).subscribe((resp) => {
      this.services.set(resp);
    });
  }

  get isFormValid() {
    return this.FormDesk.valid && this.selectedServices().length > 0;
  }
}
