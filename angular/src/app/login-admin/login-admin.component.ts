import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../lib/user';
import { Router } from '@angular/router'
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent implements OnInit {

  userForm: FormGroup;
  user: User;
  token: any;
  submitted = false;

  constructor(private toastr: ToastrService,
              private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.buildUserForm();
  }
  loginUser(): void {
    this.submitted = true;
    if (this.userForm.valid) {
      this.authService.loginUser(this.buildUserObject()).subscribe({
        next: result => this.token = result,
        error: error => { this.toastr.error(error, 'Error !!'); },
        complete: () => this.buildToken(this.token)
      });
    }
  }
  //build admin object
  buildUserObject(): User {
    return this.user = {
      "_id": this.userForm.value._id != undefined ? this.userForm.value._id : "",
      "name": this.userForm.value.name != undefined ? this.userForm.value.name : "",
      "surnames": this.userForm.value.surnames != undefined ? this.userForm.value.surnames : "",
      "email": this.userForm.value.email != undefined ? this.userForm.value.email : "",
      "password": this.userForm.value.password != undefined ? this.userForm.value.password : "",
      "country": this.userForm.value.country != undefined ? this.userForm.value.country : "",
      "birthDate": this.userForm.value.birthDate != undefined ? this.userForm.value.birthDate : "",
      "verified": this.userForm.value.Verified != undefined ? this.userForm.value.Verified : "",
    };
  }
  //build the token on session storangeer
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
  buildUserForm() {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      password: ['', Validators.required],
    });
  }
  //admin login controls 
  get formControls() { return this.userForm.controls; }

}
