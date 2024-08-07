import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomFormValidators {
  static minLengthArray(minLength: number): ValidatorFn {
    return (control: AbstractControl<string[]>): ValidationErrors | null => {
      return control.value.length < minLength
        ? { arrayMinLength: { requiredLength: minLength } }
        : null;
    };
  }

  static urlVideo(control: AbstractControl): ValidationErrors | null {
    const url = control.value;
    const isValid =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|facebook\.com|dailymotion\.com)\/.+$/i.test(
        url
      );
    return isValid ? null : { invalidUrl: true };
  }
}
