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
import { Subject, debounceTime, switchMap } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BranchService, CounterService } from '../../../../services';
import { ServiceDesk } from '../../../../../domain/models';
import { PrimengModule } from '../../../../../primeng.module';
import {
  brachResponse,
  serviceResponse,
} from '../../../../../infrastructure/interfaces';
import { minLengthArray } from '../../../../../helpers';

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
  private serviceDesk = inject(CounterService);
  private branch: ServiceDesk | undefined = inject(DynamicDialogConfig).data;

  counter: ServiceDesk | undefined = inject(DynamicDialogConfig).data;
  searchSubject$ = new Subject<string>();
  branches = signal<brachResponse[]>([]);
  services = signal<serviceResponse[]>([]);

  FormDesk: FormGroup = this.fb.nonNullable.group({
    user: ['', Validators.required],
    name: ['', Validators.required],
    number: ['', Validators.required],
    branch: ['', Validators.required],
    services: ['', [Validators.required, minLengthArray(1)]],
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

  onSelect({ id, services }: brachResponse) {
    this.FormDesk.get('brach')?.setValue(id);
    this.services.set(services);
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
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(350),
        switchMap((term) => this.branchService.searchAvaibles(term))
      )
      .subscribe((branches) => {
        console.log(branches);
        this.branches.set(branches);
      });
  }

}
