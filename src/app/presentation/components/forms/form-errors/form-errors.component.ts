import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'form-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-errors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorsComponent {
  control = input.required<AbstractControl>();



}
