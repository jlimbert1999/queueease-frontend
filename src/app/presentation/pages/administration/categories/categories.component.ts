import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../../../primeng.module';
import { CategoryComponent } from './category/category.component';
import { Category } from '../../../../domain/models';
import { CategoryService } from '../../../services';
import { filter } from 'rxjs';

type method = 'create' | 'update';
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, PrimengModule, CategoryComponent],
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class CategoriesComponent implements OnInit {
  category = signal<Category | null>(null);
  categories = signal<Category[]>([]);

  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  length = signal(0);
  private categoryService = inject(CategoryService);

  constructor(public dialogService: DialogService) {}

  ngOnInit(): void {
    this.categoryService
      .findAll(this.limit(), this.offset())
      .subscribe(({ categories, length }) => {
        this.categories.set(categories);
        this.length.set(length);
      });
  }

  create() {
    const ref = this.dialogService.open(CategoryComponent, {
      header: 'Crear Categoría',
    });
    ref.onClose
      .pipe(filter((result?: Category) => !!result))
      .subscribe((category) => {
        this.categories.update((values) => [category!, ...values]);
      });
  }

  edit(category: Category) {
    const ref = this.dialogService.open(CategoryComponent, {
      header: 'Editar Categoría',
      data: category,
    });
    ref.onClose
      .pipe(filter((result?: Category) => !!result))
      .subscribe((result) => {
        this.categories.update((values) => {
          const index = values.findIndex((el) => el.id === category.id);
          values[index] = result!;
          return [...values];
        });
      });
  }

  handleSave(event: { method: 'create' | 'update'; category: Category }) {
    if (event.method === 'create') {
      this.categories.update((values) => [event.category, ...values]);
    } else {
    }
  }
}
