import {
  AbstractControl,
  FormArray,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms'

export function noDuplicateInOptions(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formArray = control as FormArray
    const values = formArray.value.map((opt: { option: string }) => opt.option)

    const hasDuplicate = values.length !== new Set(values).size

    return hasDuplicate && values.some((element: string) => element !== '')
      ? { duplicate: true }
      : null
  }
}

export function maxOptionLengthValidator(maxLength = 32): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formArray = control as FormArray
    const hasLongOption = formArray.value.some(
      (opt: { option: string }) => opt.option.length > maxLength,
    )

    return hasLongOption ? { maxOptionLength: true } : null
  }
}

export function noDuplicateInTitleAndDescription(
  titleControlName: string,
  descriptionControlName: string,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as AbstractControl
    const title = formGroup.get(titleControlName)?.value
    const description = formGroup.get(descriptionControlName)?.value

    const isDuplicate = title === description && title && description

    return isDuplicate ? { duplicate: true } : null
  }
}
