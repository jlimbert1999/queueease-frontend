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

  datasource = signal<any[]>([]);
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
      header: 'Crear Ventanilla',
      width: '40rem',
    });
    ref.onClose
      .pipe(filter((result?: any) => !!result))
      .subscribe((category) => {
        // this.desks.update((values) => [category!, ...values]);
      });
  }

  update(desk: any) {
    const ref = this.dialogService.open(UserComponent, {
      header: 'Edicion Ventanilla',
      width: '40rem',
      data: desk,
    });
    // ref.onClose
    //   .pipe(filter((result?: ServiceDesk) => !!result))
    //   .subscribe((result) => {
    //     this.desks.update((values) => {
    //       const index = values.findIndex((el) => el.id === desk.id);
    //       values[index] = result!;
    //       return [...values];
    //     });
    //   });
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
