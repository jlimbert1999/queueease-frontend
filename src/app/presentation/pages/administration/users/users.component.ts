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
import { TagModule } from 'primeng/tag';

import { UserComponent } from './user/user.component';
import { UserService } from '../../../services';
import { userResponse } from '../../../../infrastructure/interfaces';
import {
  PageProps,
  PaginatorComponent,
  toolbarActions,
  ToolbarComponent,
} from '../../../components';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    TagModule,
    TableModule,
    ButtonModule,
    PaginatorComponent,
    ToolbarComponent,
  ],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  private dialogService = inject(DialogService);
  private userService = inject(UserService);

  datasource = signal<userResponse[]>([]);
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
    const ref = this.dialogService.open(UserComponent, {
      header: 'Crear Usuario',
      width: '40rem',
    });
    ref.onClose.subscribe((result?: userResponse) => {
      if (!result) return;
      this.datasource.update((values) => {
        values.unshift(result);
        if (values.length >= this.limit()) values.pop();
        return [...values];
      });
      this.datasize.update((value) => (value += 1));
    });
  }

  update(user: userResponse) {
    const ref = this.dialogService.open(UserComponent, {
      header: 'Edicion Usuario',
      width: '50rem',
      data: user,
    });
    ref.onClose.subscribe((result?: userResponse) => {
      if (!result) return;
      this.datasource.update((users) => {
        const index = users.findIndex((el) => el.id === user.id);
        users[index] = result!;
        return [...users];
      });
    });
  }

  getData() {
    this.userService
      .findAll(this.limit(), this.offset(), this.term())
      .subscribe(({ users, length }) => {
        this.datasource.set(users);
        this.datasize.set(length);
      });
  }

  search(value: string) {
    this.index.set(0);
    this.term.set(value);
    this.getData();
  }

  chagePage({ pageIndex, pageSize }: PageProps): void {
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
