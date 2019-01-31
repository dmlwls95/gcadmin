import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  constructor(private afAuth: AngularFireAuth, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.afAuth.auth.setPersistence('none');
  }

  get f() { return this.loginForm.controls; }

  tempAuth(email: string, password: string ) {
    if ( email === 'a@a.c' && password === 'aaa') {
      this.router.navigate(['main']);
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    // this.tempAuth(this.f.username.value, this.f.password.value);
    this.afAuth.auth.signInWithEmailAndPassword(this.f.username.value, this.f.password.value).then(value => {
      this.router.navigate(['main']);
        console.log('logedin');
      }).catch(function(error) {
    });
  }
}
