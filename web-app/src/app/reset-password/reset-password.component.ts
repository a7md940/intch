import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppValidator } from '../utils/app-validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form = new FormGroup({
    password: new FormControl(null, [AppValidator.required, AppValidator.minLength(6)]),
    confirmPassword: new FormControl(
      null,
      [
        AppValidator.required,
        AppValidator.minLength(6),
        AppValidator.matchAnotherController('password')
      ]
    ),
  });

  constructor(private _authService: AuthService, private _router: Router) { }

  ngOnInit(): void {
  }

  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log(this.form);
      return;
    }
    const { password } = this.form.value;
    this._authService.createUserPassword(password)
      .subscribe(
        (resp) => {
          console.log(resp);
          this._router.navigate(['/login']);
        },
        (error) => {

        }
      );
  }
}
