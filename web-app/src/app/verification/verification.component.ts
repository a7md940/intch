import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { VerificationService } from '../services/verification.service';
import { AppValidator } from '../utils/app-validators';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  verificationCode!: string;
  form = new FormGroup({
    code: new FormControl(null, [AppValidator.required])
  });

  constructor(
    private _verificationService: VerificationService
  ) { }

  ngOnInit(): void {

  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.verificationCode = this.form.value.code;
    this._verificationService.verifyEmail(this.verificationCode)
      .subscribe(
        (resp) => {
          console.log(resp)
        },
        (err) => {

        }
      );
  }
}
