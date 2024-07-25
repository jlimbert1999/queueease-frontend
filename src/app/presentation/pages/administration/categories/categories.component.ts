import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';

import { categoryResponse } from '../../../../infrastructure/interfaces';
import { CategoryComponent } from './category/category.component';
import { PrimengModule } from '../../../../primeng.module';
import { CategoryService } from '../../../services';
import {
  PageProps,
  PaginatorComponent,
  toolbarActions,
  ToolbarComponent,
} from '../../../components';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule,
    CategoryComponent,
    PaginatorComponent,
    ToolbarComponent,
  ],
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private dialogService = inject(DialogService);

  datasource = signal<categoryResponse[]>([]);
  datasize = signal(0);

  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  term = signal<string>('');

  readonly actions: toolbarActions[] = [
    { icon: 'pi pi-plus', value: 'create', tooltip: 'Crear' },
  ];

  ngOnInit(): void {
    this.getData();
  }

  create() {
    const ref = this.dialogService.open(CategoryComponent, {
      header: 'Crear Categoría',
    });
    ref.onClose.subscribe((result?: categoryResponse) => {
      if (!result) return;
      this.datasource.update((values) => {
        values.unshift(result);
        if (values.length >= this.limit()) values.pop();
        return [...values];
      });
      this.datasize.update((value) => (value += 1));
    });
  }

  edit(category: categoryResponse) {
    const ref = this.dialogService.open(CategoryComponent, {
      header: 'Editar Categoría',
      data: category,
    });
    ref.onClose.subscribe((result) => {
      if (!result) return;
      this.datasource.update((values) => {
        const index = values.findIndex((el) => el.id === category.id);
        values[index] = result!;
        return [...values];
      });
    });
  }

  getData() {
    this.categoryService
      .findAll(this.limit(), this.offset(), this.term())
      .subscribe(({ categories, length }) => {
        this.datasource.set(categories);
        this.datasize.set(length);
      });
  }

  search(value: string) {
    this.term.set(value);
    this.index.set(0);
    this.getData();
  }

  chagePage({ pageIndex, pageSize }: PageProps) {
    this.index.set(pageIndex);
    this.limit.set(pageSize);
    this.getData();
  }

  handleActions(action: string) {
    switch (action) {
      case 'create':
        this.create();
        break;
      default:
        break;
    }
  }
}
