import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime } from 'rxjs';
import { Dropdown } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { brachResponse } from '../../../../../infrastructure/interfaces';
import { BranchService, ServiceService } from '../../../../services';
import { PrimengModule } from '../../../../../primeng.module';
interface serviceProps {
  id: string;
  name: string;
}
@Component({
  selector: 'app-branch',
  standalone: true,
  imports: [CommonModule, PrimengModule, ReactiveFormsModule, FormsModule],
  templateUrl: './branch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchComponent implements OnInit {
  private brachService = inject(BranchService);
  private serviceService = inject(ServiceService);
  private branch?: brachResponse = inject(DynamicDialogConfig).data;
  private ref = inject(DynamicDialogRef);
  private dropdown = viewChild.required<Dropdown>('dropdown');

  private searchSubject$ = new Subject<string>();
  private destroyRef = inject(DestroyRef);

  services = signal<serviceProps[]>([]);
  selectedServices = signal<serviceProps[]>([]);
  FormBranch = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  ngOnInit(): void {
    if (this.branch) {
      const { services = [], name } = this.branch;
      this.FormBranch.setValue(name);
      this.selectedServices.set(services);
    }
    this.searchSubject$
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(350))
      .subscribe((text) => this.searchServices(text));
  }

  save() {
    // const subscription = this.branch
    //   ? this.brachService.update(
    //       this.branch.id,
    //       this.FormBranch.value,
    //       this.selectedServices()
    //     )
    //   : this.brachService.create(
    //       this.FormBranch.value,
    //       this.selectedServices()
    //     );
    // subscription.subscribe((resp) => this.ref.close(resp));
  }

  onFilterDropdown(term?: string) {
    if (!term) return;
    this.searchSubject$.next(term);
  }

  searchServices(term: string) {
    this.serviceService
      .searchAvailables(term)
      .subscribe((services) => this.services.set(services));
  }

  addService(service: serviceProps) {
    this.dropdown().resetFilter();
    const duplicate = this.selectedServices().find(
      ({ id }) => id === service.id
    );
    if (duplicate) return;
    this.selectedServices.update((values) => [service, ...values]);
  }

  removeService(service: serviceProps) {
    this.selectedServices.update((values) =>
      values.filter((el) => el.id !== service.id)
    );
  }

  get isFormValid() {
    return this.FormBranch.valid && this.selectedServices().length > 0;
  }
}
