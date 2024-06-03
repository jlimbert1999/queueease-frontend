import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';

interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

export interface PageProps {
  pageIndex: number;
  pageSize: number;
}

@Component({
  selector: 'paginator',
  standalone: true,
  imports: [CommonModule, PaginatorModule],
  template: `
    @if(length()>0){
    <div class="flex align-items-center justify-content-end">
      <span class="mx-1 text-color">Pagina: </span>
      <p-paginator
        [first]="first()"
        [rows]="rows()"
        [totalRecords]="length()"
        (onPageChange)="changePage($event)"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="{first} - {last} de {totalRecords}"
        [showPageLinks]="false"
        [showFirstLastIcon]="true"
      ></p-paginator>
    </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  rows = input.required<number>();
  first = input.required<number>();
  length = input.required<number>();
  onPageChange = output<PageProps>();

  changePage({ page = 0, rows = 10 }: PageEvent) {
    this.onPageChange.emit({ pageSize: rows, pageIndex: page });
  }
}
