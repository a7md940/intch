import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { VerificationService } from '../services/verification.service';
import { AppValidator } from '../utils/app-validators';

@Component({
    selector: 'app-resend-verification',
    templateUrl: './resend-verification.component.html',
    styleUrls: ['./resend-verification.component.scss'],
})
export class ResendVerificationComponent implements OnInit {
    form = new FormGroup({
        email: new FormControl(null, [
            AppValidator.required,
            AppValidator.email,
        ]),
    });
    email!: string;
    emailResendSuccess = false;
    httpError: HttpErrorResponse | null = null;
    constructor(
        private _verificationService: VerificationService,
        private _router: Router
    ) {}

    ngOnInit(): void {}

    resendEmail(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            console.log(this.form);
            return;
        }

        this.email = this.form.value.email;
        this._verificationService.resendEmail(this.email).subscribe(
            (resp) => {
                this.emailResendSuccess = true;
                this._router.navigate(['/verify']);
            },
            (err) => {
                this.httpError = err;
            }
        );
    }
}
