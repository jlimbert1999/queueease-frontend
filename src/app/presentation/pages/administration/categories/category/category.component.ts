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
import { Category } from '../../../../../domain/models';
import { CategoryService } from '../../../../services';

interface SaveEvent {
  method: 'create' | 'update';
  category: Category;
}
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
  private category?: Category = inject(DynamicDialogConfig).data;
  private ref = inject(DynamicDialogRef);

  ngOnInit(): void {
    if (this.category) this.FormCategory.patchValue(this.category.name);
  }

  save() {
    if (!this.category) {
      this.categoryService
        .create(this.FormCategory.value)
        .subscribe((category) => {
          this.ref.close(category);
        });
    } else {
      this.categoryService
        .update(this.category.id, this.FormCategory.value)
        .subscribe((category) => {
          this.ref.close(category);
        });
    }
  }
}
