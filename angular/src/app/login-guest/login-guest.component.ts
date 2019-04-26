import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Guest } from '../lib/guest';
import { Router } from '@angular/router'
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login-guest',
  templateUrl: './login-guest.component.html',
  styleUrls: ['./login-guest.component.css']
})
export class LoginGuestComponent implements OnInit {

  guestForm: FormGroup;
  guest: Guest;
  token: any;
  submitted = false;

  constructor(private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.buildGuestForm();
  }

  loginGuest(): void {
    this.submitted = true;
    if (this.guestForm.valid) {
      this.authService.loginGuest(this.buildGuestObject()).subscribe({
        next: result => this.token = result,
        error: error => { this.toastr.error(error, 'Error !!'); },
        complete: () => this.buildToken(this.token)
      });
    }
  }

  //build guest object
  buildGuestObject(): Guest {
    return this.guest = {
      "_id": this.guestForm.value._id != undefined ? this.guestForm.value._id : "",
      "fullname": this.guestForm.value.fullname != undefined ? this.guestForm.value.fullname : "",
      "username": this.guestForm.value.username != undefined ? this.guestForm.value.username : "",
      "pin": this.guestForm.value.pin != undefined ? this.guestForm.value.pin : "",
      "age": this.guestForm.value.age != undefined ? this.guestForm.value.age : "",
      "user_id": this.guestForm.value.user_id != undefined ? this.guestForm.value.user_id : ""
    };

  }
  //build the token on session storage
  //@Token -> user information from db
  buildToken(token: any) {
    if (token.token === null) {
      this.toastr.error('Usuario icorrecto', 'Error x(');
    } else {
      sessionStorage.setItem('access_token', token._token);
      sessionStorage.setItem('fullname', token.fullname);
      sessionStorage.setItem('role', token.role);
      this.toastr.success('Bienvenido', 'TukeKids')
      this.router.navigate(['/']);
    }
  }

  //Build form with validations
  buildGuestForm() {
    this.guestForm = this.formBuilder.group({
      username: ['', Validators.required],
      pin: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  //admin login controls 
  //admin login controls 
  get formControls() { return this.guestForm.controls; }

}
