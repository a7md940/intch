import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { AppValidator } from '../utils/app-validators';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
    form!: FormGroup;
    httpError?: { code: string; message: string };
    constructor(private _authService: AuthService, private _router: Router) {}

    ngOnInit(): void {
        this._buildForm();
    }

    submit(): void {
        try {
            const { username, email } = this.form.value;
            if (this.form.invalid) {
                this.form.markAllAsTouched();
                return;
            }

            this._authService.signup(username, email).subscribe(
                (resp) => {
                    this._router.navigate(['/verify']);
                },
                (err) => {
                    if (err instanceof HttpErrorResponse) {
                        this.httpError = err.error;
                    }
                }
            );
        } catch (exc) {
            console.error(exc);
        }
    }
    private _buildForm(): void {
        this.form = new FormGroup({
            username: new FormControl(null, [AppValidator.required]),
            email: new FormControl(null, [
                AppValidator.required,
                AppValidator.email,
            ]),
        });
    }
}
