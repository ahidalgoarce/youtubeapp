import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { compareValidator } from '../shared/confirm-equal-validator.directive';
import { AdminService } from '../services/admin.service';
import { User } from '../lib/user';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {

  users: User[];
  user: any;
  formUser: FormGroup;

  constructor(private adminService: AdminService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.buildFormToUpdate();
    this.getUserById();
  }
  //function save user
  // @user -> object type array
  updateUser(user: User): void {
    this.adminService.updateUser(user).subscribe({
      next: response => {this.buildObjectUser(response), sessionStorage.setItem('fullname', `${user.name} ${user.surnames}`)},
      error: error => this.toastr.error(error, "Error :("),
      complete: () => {this.toastr.success('Perfil Editado', 'Exito!!'),this.router.navigate(['/'])}
    });
  }
  //function get user by id
  //@id-> item to edit from users table 
  getUserById(): void {
    this.adminService.getUserById().subscribe({
      next: newUser => { this.buildObjectUser(newUser), this.toastr.success('Usuario cargado', 'Exito!!'); },
      error: error => this.toastr.error(error, "Error :("),
      complete: () => this.buildForm(this.user)
    });
  }
  //Build form with validations
  buildFormToUpdate(): void {
    this.formUser = this.formBuilder.group({
      name: ['', Validators.required],
      surnames: ['', Validators.required],
      country: ['', Validators.required],
      birthDate: ['', Validators.required],
      // birthDate: ['', [Validators.required, Validators.pattern("^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$")]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      password: ['000000', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['000000', [Validators.required, compareValidator('password')]]
    });
  }
  //Submit modal
  onSubmit(): void {
    if (this.formUser.status != 'INVALID') {
      this.user = {
        "_id": this.route.snapshot.paramMap.get('id') !== null ? this.route.snapshot.paramMap.get('id') : null,
        "name": this.formUser.value.name,
        "surnames": this.formUser.value.surnames,
        "email": this.formUser.value.email,
        "password": this.formUser.value.password,
        "country": this.formUser.value.country,
        "birthDate": this.formUser.value.birthDate
      };
      this.updateUser(this.user);
    } else {
      this.toastr.error("Errores en el formulario", "Error !!")
    }
  }
  //create user object
  buildObjectUser(response: any) {
    return this.user = {
      "_id": response._id !== undefined ? response._id : '',
      "name": response.name,
      "surnames": response.surnames,
      "email": response.email,
      "country": response.country,
      "birthDate": response.birthDate,
      "password": response.password,
    };
  }
  //Load items to form
  // @user -> items from database
  buildForm(user: User): void {
    const date = new Date(user.birthDate);
    this.formUser.get('name').setValue(user.name);
    this.formUser.get('surnames').setValue(user.surnames);
    this.formUser.get('email').setValue(user.email);
    this.formUser.get('country').setValue(user.country);
    this.formUser.get('birthDate').setValue(`${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)}-${date.getDate() + 1 < 10 ? '0' + (date.getDate() + 1) : (date.getDate() + 1)}`);
  }

  //function register forms control in view
  get formControls() { return this.formUser.controls; }
  // get values
  get password() {
    return this.formUser.get('password');
  }
  get pwConfirm() {
    return this.formUser.get('passwordConfirm');
  }

}
