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
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../../../../primeng.module';
import { ServiceService } from '../../../../services';
import {
  categoryResponse,
  serviceResponse,
} from '../../../../../infrastructure/interfaces';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimengModule],
  templateUrl: './service.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceComponent implements OnInit {
  private serviceService = inject(ServiceService);
  private fb = inject(FormBuilder);
  private service?: serviceResponse = inject(DynamicDialogConfig).data;
  private ref = inject(DynamicDialogRef);

  categories = signal<categoryResponse[]>([]);
  FormService: FormGroup = this.fb.group({
    name: ['', Validators.required],
    code: ['', [Validators.required, Validators.pattern(/^[a-zA-Z-]*$/)]],
    category: [],
  });

  ngOnInit(): void {
    this._getCategories();
    if (this.service) {
      const { category, ...props } = this.service;
      this.FormService.patchValue({ ...props, category: category?.id });
    }
  }

  save() {
    const subscription = this.service
      ? this.serviceService.update(this.service.id, this.FormService.value)
      : this.serviceService.create(this.FormService.value);
    subscription.subscribe((resp) => this.ref.close(resp));
  }

  private _getCategories() {
    this.serviceService.getCategories().subscribe((categories) => {
      this.categories.set(categories);
    });
  }
}
