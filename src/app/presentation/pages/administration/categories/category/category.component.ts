import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../../../../primeng.module';
import { CategoryService } from '../../../../services';
import { categoryResponse } from '../../../../../infrastructure/interfaces';

@Component({
  selector: 'category',
  standalone: true,
  imports: [CommonModule, PrimengModule, ReactiveFormsModule],
  templateUrl: './category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent implements OnInit {
  FormCategory = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  private categoryService = inject(CategoryService);
  private category?: categoryResponse = inject(DynamicDialogConfig).data;
  private ref = inject(DynamicDialogRef);

  ngOnInit(): void {
    if (this.category) this.FormCategory.patchValue(this.category.name);
  }

  save() {
    const subscription = this.category
      ? this.categoryService.update(this.category.id, this.FormCategory.value)
      : this.categoryService.create(this.FormCategory.value);
    subscription.subscribe((resp) => this.ref.close(resp));
  }
}
