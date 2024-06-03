import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { filter } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { BranchService } from '../../../services';
import { brachResponse } from '../../../../infrastructure/interfaces';
import { BranchComponent } from './branch/branch.component';
import { PrimengModule } from '../../../../primeng.module';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class BranchesComponent {
  private branchService = inject(BranchService);
  private dialogService = inject(DialogService);
  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());

  datasource = signal<brachResponse[]>([]);
  datasize = signal(0);
  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.branchService
      .findAll(this.limit(), this.offset())
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
    ref.onClose
      .pipe(filter((result?: brachResponse) => !!result))
      .subscribe((category) => {
        this.datasource.update((values) => [category!, ...values]);
      });
  }

  update(branch: brachResponse) {
    const ref = this.dialogService.open(BranchComponent, {
      header: 'Edicion Sucursal',
      width: '50rem',
      data: branch,
    });
    ref.onClose
      .pipe(filter((result?: brachResponse) => !!result))
      .subscribe((result) => {
        this.datasource.update((values) => {
          const index = values.findIndex((el) => el.id === branch.id);
          values[index] = result!;
          return [...values];
        });
      });
  }
}
