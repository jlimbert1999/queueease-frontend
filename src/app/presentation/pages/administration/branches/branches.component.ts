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
import { PrimengModule } from '../../../../primeng.module';
import { SecureUrlPipe } from '../../../pipes/secure-url.pipe';
import { BranchComponent } from './branch/branch.component';
import { PublicationsComponent } from './publications/publications.component';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule, PrimengModule, SecureUrlPipe],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.scss',
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
  term = '';

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const supscription =
      this.term !== ''
        ? this.branchService.search(this.term, this.limit(), this.offset())
        : this.branchService.findAll(this.limit(), this.offset());
    supscription.subscribe(({ branches, length }) => {
      this.datasource.set(branches);
      this.datasize.set(length);
    });
  }

  create() {
    const ref = this.dialogService.open(BranchComponent, {
      header: 'Crear Sucursal',
      width: '60rem',
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
      width: '60rem',
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

  announce() {
    const ref = this.dialogService.open(PublicationsComponent, {
      header: 'Anunciar',
      width: '50%',
      breakpoints: {
        '960px': '90vw',
      },
    });
  }
}
