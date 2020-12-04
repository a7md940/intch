import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export class AppValidator extends Validators {
    constructor() {
        super();
    }

    arrayRequired = (control: AbstractControl): ValidationErrors | null => {
        const controlValue = control.value;
        if (Array.isArray(controlValue) && controlValue.length === 0) {
            return { arrayIsRequired: true };
        }
        return null;
    }
}
