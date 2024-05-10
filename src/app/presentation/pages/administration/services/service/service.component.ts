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
import { Category, Service } from '../../../../../domain/models';
import { ServiceService } from '../../../../services';

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
  private service?: Service = inject(DynamicDialogConfig).data;
  private ref = inject(DynamicDialogRef);

  categories = signal<Category[]>([]);
  FormService: FormGroup = this.fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    category: [],
  });

  ngOnInit(): void {
    if (this.service) {
      console.log(this.service);
      const { category, ...props } = this.service;
      this.FormService.patchValue({ ...props, category: category?.id });
    }
    this.serviceService.getCategories().subscribe((resp: Category[]) => {
      this.categories.set(resp);
    });
  }

  save() {
    const subscription = this.service
      ? this.serviceService.update(this.service.id, this.FormService.value)
      : this.serviceService.create(this.FormService.value);
    subscription.subscribe((resp) => this.ref.close(resp));
  }
}
