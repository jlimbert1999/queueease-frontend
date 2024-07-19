import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

import { PreferenceComponent } from './preference/preference.component';
import { preferenceResponse } from '../../../../infrastructure/interfaces';
import { PageProps, PaginatorComponent } from '../../../components';
import { PreferenceService } from '../../../services';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    FormsModule,
    InputTextModule,
    PaginatorComponent,
  ],
  templateUrl: './preferences.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreferencesComponent implements OnInit {
  private preferenceService = inject(PreferenceService);
  private dialogService = inject(DialogService);

  datasource = signal<preferenceResponse[]>([]);
  datasize = signal(0);

  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  term: string = '';

  ngOnInit(): void {
    this.getData();
  }

  create() {
    const ref = this.dialogService.open(PreferenceComponent, {
      header: 'Crear Preferencia',
      width: '40rem',
    });
    ref.onClose.subscribe((result?: preferenceResponse) => {
      if (!result) return;
      this.datasource.update((values) => [result, ...values]);
      this.datasize.update((value) => (value += 1));
    });
  }

  update(preference: preferenceResponse) {
    const ref = this.dialogService.open(PreferenceComponent, {
      header: 'Edicion Preferencia',
      width: '40rem',
      data: preference,
    });
    ref.onClose.subscribe((result?: preferenceResponse) => {
      if (!result) return;
      this.datasource.update((values) => {
        const index = values.findIndex(({ id }) => id === preference.id);
        values[index] = result;
        return [...values];
      });
    });
  }

  getData() {
    const supscription =
      this.term !== ''
        ? this.preferenceService.search(this.term, this.limit(), this.offset())
        : this.preferenceService.findAll(this.limit(), this.offset());
    supscription.subscribe(({ preferences, length }) => {
      this.datasource.set(preferences);
      this.datasize.set(length);
    });
  }

  search() {
    this.index.set(0);
    this.getData();
  }

  chagePage({ pageIndex, pageSize }: PageProps) {
    this.index.set(pageIndex);
    this.limit.set(pageSize);
    this.getData();
  }
}
