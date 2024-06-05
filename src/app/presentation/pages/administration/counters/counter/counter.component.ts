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
import { BranchService, ServiceCounterService } from '../../../../services';
import { ServiceDesk } from '../../../../../domain/models';
import { PrimengModule } from '../../../../../primeng.module';
import { brachResponse } from '../../../../../infrastructure/interfaces';

@Component({
  selector: 'service-desk',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PrimengModule],
  templateUrl: './counter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private destroyRef = inject(DestroyRef);
  private branchService = inject(BranchService);
  private serviceDesk = inject(ServiceCounterService);
  private branch: ServiceDesk | undefined = inject(DynamicDialogConfig).data;

  counter: ServiceDesk | undefined = inject(DynamicDialogConfig).data;
  searchSubject$ = new Subject<string>();
  branches = signal<brachResponse[]>([]);
  FormDesk: FormGroup = this.fb.nonNullable.group({
    name: ['', Validators.required],
    number: ['', Validators.required],
    branch: ['', Validators.required],
  });

  constructor() {}

  ngOnInit(): void {
    if (this.counter) {
      // const { services, branch, ...props } = this.desk;
      // this._getServicesByBranch(branch.id);
      // this.FormDesk.removeControl('branch');
      // this.FormDesk.patchValue(props);
      // this.selectedServices.set(services);
    } else {
      this._observeChangesDrowpdown();
    }
  }

  onFilter(term?: string) {
    if (!term) return;
    this.searchSubject$.next(term);
  }

  onSelect(id: number) {
    // this.selectedServices.set([]);
    // this._getServicesByBranch(id);
  }

  save() {
    // const subscription = this.branch
    //   ? this.serviceDesk.update(this.branch.id, {
    //       ...this.FormDesk.value,
    //       services: this.selectedServices().map((el) => el.id),
    //     })
    //   : this.serviceDesk.create(this.FormDesk.value, this.selectedServices());
    // subscription.subscribe((resp) => this.ref.close(resp));
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

  private _getServicesByBranch(id: string) {
    // this.branchService.getServicesByBranch(id).subscribe((resp) => {
    //   this.services.set(resp);
    // });
  }

  get isFormValid() {
    return this.FormDesk.valid;
  }
}
