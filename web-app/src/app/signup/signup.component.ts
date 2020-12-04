import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { AppValidator } from '../utils/app-validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }


  ngOnInit(): void {
    this._buildForm();
  }

  submit(): void {
    const { username, email } = this.form.value;
    console.log(this.form)
    if (this.form.valid) {
      this._authService.signup(username, email)
        .subscribe(
          (resp) => {
            this._router.navigate(['/']);
          },
          (err) => {

          }
        );
    }
  }
  private _buildForm(): void {
    this.form = new FormGroup({
      username: new FormControl(null, [AppValidator.required]),
      email: new FormControl(null, [AppValidator.required, AppValidator.email])
    });
  }
}
