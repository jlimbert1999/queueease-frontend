import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { filter } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../../../primeng.module';
import { CategoryComponent } from './category/category.component';
import { CategoryService } from '../../../services';
import { categoryResponse } from '../../../../infrastructure/interfaces';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, PrimengModule, CategoryComponent],
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class CategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private dialogService = inject(DialogService);

  datasource = signal<categoryResponse[]>([]);
  datasize = signal(0);

  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  term = '';

  ngOnInit(): void {
    this.getData();
  }

  create() {
    const ref = this.dialogService.open(CategoryComponent, {
      header: 'Crear Categoría',
    });
    ref.onClose
      .pipe(filter((result?: categoryResponse) => !!result))
      .subscribe((category) => {
        this.datasource.update((values) => [category!, ...values]);
        this.datasize.update((value) => (value += 1));
      });
  }

  edit(category: categoryResponse) {
    const ref = this.dialogService.open(CategoryComponent, {
      header: 'Editar Categoría',
      data: category,
    });
    ref.onClose
      .pipe(filter((result?: categoryResponse) => !!result))
      .subscribe((result) => {
        this.datasource.update((values) => {
          const index = values.findIndex((el) => el.id === category.id);
          values[index] = result!;
          return [...values];
        });
      });
  }

  getData() {
    const supscription =
      this.term !== ''
        ? this.categoryService.search(this.term, this.limit(), this.offset())
        : this.categoryService.findAll(this.limit(), this.offset());
    supscription.subscribe(({ categories, length }) => {
      this.datasource.set(categories);
      this.datasize.set(length);
    });
  }
}
