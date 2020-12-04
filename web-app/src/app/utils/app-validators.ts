import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

export class AppValidator extends Validators {
    constructor() {
        super();
    }

    static arrayRequired = (control: AbstractControl): ValidationErrors | null => {
        const controlValue = control.value;
        if (Array.isArray(controlValue) && controlValue.length === 0) {
            return { arrayIsRequired: true };
        }
        return null;
    }

    static matchAnotherController = (controlName: string) => (control: AbstractControl): ValidationErrors | null => {
        const parent = control.parent;

        if (control && parent) {
            const matchingControl = parent.get(controlName);
            if (matchingControl && control.value === matchingControl.value) {
                return null;
            }
        }

        return { notMatched: true };
    }
}
