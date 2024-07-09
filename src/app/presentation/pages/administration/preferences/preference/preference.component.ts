import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';

import { PreferenceService } from '../../../../services';
import { preferenceResponse } from '../../../../../infrastructure/interfaces';

@Component({
  selector: 'app-preference',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    InputTextModule,
    InputNumberModule,
    ReactiveFormsModule,
    FloatLabelModule,
  ],
  templateUrl: './preference.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreferenceComponent implements OnInit {

  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private preferenceService = inject(PreferenceService);

  preference: preferenceResponse | undefined = inject(DynamicDialogConfig).data;
  FormPreference: FormGroup = this.fb.nonNullable.group({
    name: ['', Validators.required],
    acronym: ['', [Validators.required, Validators.pattern("^[a-zA-Z]+$")]],
    priority: [0, Validators.required],
  });

  ngOnInit(): void {
    this._loadFormData()
  }


  save() {
    const subscription = this.preference
      ? this.preferenceService.update(
          this.preference.id,
          this.FormPreference.value
        )
      : this.preferenceService.create(this.FormPreference.value);
    subscription.subscribe((resp) => this.ref.close(resp));
  }

  private _loadFormData() {
    if (!this.preference) return;
    this.FormPreference.patchValue(this.preference);
  }
}
