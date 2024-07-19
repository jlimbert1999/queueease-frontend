import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { AlertService, BranchService } from '../../../../services';
import { CustomFormValidators } from '../../../../../helpers';
import { SecureUrlPipe } from '../../../../pipes/secure-url.pipe';
import { brachResponse } from '../../../../../infrastructure/interfaces';
import { FormErrorsComponent } from '../../../../components/forms/form-errors/form-errors.component';
@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    SecureUrlPipe,
    ListboxModule,
    FormErrorsComponent,
  ],
  templateUrl: './publications.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationsComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef);
  private branchServices = inject(BranchService);
  private alertService = inject(AlertService);

  branches = signal<brachResponse[]>([]);
  FormPublication: FormGroup = this.formBuilder.group({
    url: ['', [Validators.required, CustomFormValidators.urlVideo]],
    branches: [
      '',
      [Validators.required, CustomFormValidators.minLengthArray(1)],
    ],
  });

  ngOnInit(): void {
    this._getBranches();
  }

  save() {
    if (this.FormPublication.invalid) return;
    const { url, branches } = this.FormPublication.value;
    this.branchServices.announce(url, branches).subscribe(() => {
      this.dialogRef.close();
    });
  }

  remove() {
    this.alertService
      .question(
        '¿Elimiar Anuncios?',
        'Las sucursales seleccionadas volveran a mostrar el contenido'
      )
      .subscribe(() => {
        console.log('deleted');
      });
    // const { branches } = this.FormPublication.value;
    // this.branchServices.announce(null, branches).subscribe(() => {
    //   this.dialogRef.close();
    // });
  }

  get isSelectedBranch() {
    return this.FormPublication.get('branches')?.valid;
  }

  private _getBranches() {
    this.branchServices.searchAvaibles().subscribe((branches) => {
      this.branches.set(branches);
    });
  }
}
