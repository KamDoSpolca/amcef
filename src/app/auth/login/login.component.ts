import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public formGroup: FormGroup = this.fb.group({});

  constructor(
    private authservice: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  // Login is mocked due to missing BE - Just FE app demonstration
  public onLogin() {
    const email = this.formGroup.get('email')?.value;
    const pass = this.formGroup.get('password')?.value;

    this.authservice.login(email, pass);
  }

}
