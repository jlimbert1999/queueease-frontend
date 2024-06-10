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
import { UserComponent } from './user/user.component';
import { PrimengModule } from '../../../../primeng.module';
import { UserService } from '../../../services';
import { userResponse } from '../../../../infrastructure/interfaces';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class UsersComponent implements OnInit {
  private dialogService = inject(DialogService);
  private userService = inject(UserService);

  datasource = signal<userResponse[]>([]);
  datasize = signal(0);

  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  term = '';

  ngOnInit(): void {
    this.getData();
  }

  create() {
    const ref = this.dialogService.open(UserComponent, {
      header: 'Crear Usuario',
      width: '40rem',
    });
    ref.onClose
      .pipe(filter((result?: userResponse) => !!result))
      .subscribe((user) => {
        this.datasource.update((values) => [user!, ...values]);
        this.datasize.update((value) => (value += 1));
      });
  }

  update(desk: any) {
    const ref = this.dialogService.open(UserComponent, {
      header: 'Edicion Usuario',
      width: '40rem',
      data: desk,
    });
    ref.onClose
      .pipe(filter((result?: userResponse) => !!result))
      .subscribe((user) => {
        this.datasource.update((users) => {
          const index = users.findIndex((el) => el.id === desk.id);
          users[index] = user!;
          return [...users];
        });
      });
  }

  getData() {
    const supscription =
      this.term !== ''
        ? this.userService.search(this.term, this.limit(), this.offset())
        : this.userService.findAll(this.limit(), this.offset());
    supscription.subscribe(({ users, length }) => {
      this.datasource.set(users);
      this.datasize.set(length);
    });
  }

  // TODO add search method
}
