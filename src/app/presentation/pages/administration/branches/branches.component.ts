import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../../../primeng.module';
import { brachResponse } from '../../../../infrastructure/interfaces';
import { SecureUrlPipe } from '../../../pipes/secure-url.pipe';
import { PublicationsComponent } from './publications/publications.component';
import { BranchService } from '../../../services';
import {
  PageProps,
  PaginatorComponent,
  ToolbarComponent,
  toolbarActions,
} from '../../../components';
import { BranchComponent } from './branch/branch.component';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule,
    SecureUrlPipe,
    PaginatorComponent,
    ToolbarComponent,
  ],
  templateUrl: './branches.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchesComponent {
  private branchService = inject(BranchService);
  private dialogService = inject(DialogService);
  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());

  datasource = signal<brachResponse[]>([]);
  datasize = signal(0);
  term = signal<string>('');

  readonly actions: toolbarActions[] = [
    { icon: 'pi pi-megaphone', value: 'announce', tooltip: 'Anunciar' },
    { icon: 'pi pi-plus', value: 'create', tooltip: 'Crear' },
  ];

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.branchService
      .findAll(this.limit(), this.offset(), this.term())
      .subscribe(({ branches, length }) => {
        this.datasource.set(branches);
        this.datasize.set(length);
      });
  }

  create() {
    const ref = this.dialogService.open(BranchComponent, {
      header: 'Crear Sucursal',
      width: '50rem',
    });
    ref.onClose.subscribe((branch?: brachResponse) => {
      if (!branch) return;
      this.datasource.update((values) => [branch, ...values]);
    });
  }

  update(branch: brachResponse) {
    const ref = this.dialogService.open(BranchComponent, {
      header: 'Edicion Sucursal',
      width: '50rem',
      data: branch,
    });
    ref.onClose.subscribe((result: brachResponse) => {
      if (!result) return;
      this.datasource.update((values) => {
        const index = values.findIndex((el) => el.id === branch.id);
        values[index] = result;
        return [...values];
      });
    });
  }

  announce() {
    const ref = this.dialogService.open(PublicationsComponent, {
      header: 'Anunciar',
      width: '60%',
      breakpoints: {
        '960px': '90vw',
      },
    });
  }

  search(value: string) {
    this.index.set(0);
    this.term.set(value);
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
      case 'announce':
        this.announce();
        break;
      default:
        break;
    }
  }
}
