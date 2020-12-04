import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppValidator } from '../utils/app-validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  from = new FormGroup({
    username: new FormControl(null, [AppValidator.required]),
    password: new FormControl(null, [AppValidator.required])
  });

  constructor(private _authService: AuthService, private _router: Router) { }

  ngOnInit(): void {
  }

  submit(): void {
    const { username, password } = this.from.value;
    this._authService.signin(username, password)
      .subscribe(
        (resp) => {
          this._router.navigate(['/home']);
          localStorage.setItem('userAuth', JSON.stringify(resp));
        },
        (err) => {

        }
      );
  }
}
