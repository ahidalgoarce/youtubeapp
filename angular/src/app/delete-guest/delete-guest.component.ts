import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { compareValidator } from '../shared/confirm-equal-validator.directive';
import { GuestService } from '../services/guest.service';
import { Guest } from '../lib/guest';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delete-guest',
  templateUrl: './delete-guest.component.html',
  styleUrls: ['./delete-guest.component.css']
})
export class DeleteGuestComponent implements OnInit {

  private guest: any;
  formGuest: FormGroup;

  constructor(private guestService: GuestService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.buildFormGuest();
    this.getGuestById(this.route.snapshot.paramMap.get('id'));
  }


  //function get  guest by id
  // @id -> item selected
  deleteGuest(id: string): void {
    this.guestService.deleteGuest(id).subscribe({
      next: response => this.router.navigate(['/invitados']),
      error: error => this.toastr.error(error, "Error !!"),
      complete: () => { },
    });
  }

  //function get guest by id
  //@id-> item to edit from guest table 
  getGuestById(id: string): void {
    this.guestService.getGuestById(id).subscribe({
      next: response => { this.buildObjectGuest(response), this.toastr.success('Invitado cargado', 'Exito!!'); },
      error: error => this.toastr.error(error, "Error :("),
      complete: () => { this.buildForm(this.guest) },
    });
  }
  //function save and update guest
  eliminar() {
    this.deleteGuest(this.route.snapshot.paramMap.get('id'));
  }

  //create guest object
  buildObjectGuest(response: any) {
    return this.guest = {
      "_id": response._id != undefined ? response._id : '',
      "fullname": response.fullname,
      "username": response.username,
      "age": response.age,
      "pin": response.pin,
      "user_id": response.user_id,
    };
  }

  //Build form with validations
  buildFormGuest(): void {
    this.formGuest = this.formBuilder.group({
      fullname: ['', Validators.required],
      age: ['', Validators.required],
      username: ['', Validators.required],
      pin: ['00000', [Validators.required]],
      pinConfirm: ['00000', [Validators.required, compareValidator('pin')]]
    });
  }
  //Build form with validations
  buildFormToUpdate(): void {
    this.formGuest = this.formBuilder.group({
      fullname: ['', Validators.required],
      age: ['', Validators.required],
      username: ['', Validators.required],
      pin: ['0000', [Validators.required]],
      pinConfirm: ['0000', [Validators.required, compareValidator('pin')]]
    });
  }
  //Load items to modal
  // @user -> items from database
  buildForm(guest: Guest): void {
    this.formGuest.get('fullname').setValue(guest.fullname);
    this.formGuest.get('age').setValue(guest.age);
    this.formGuest.get('username').setValue(guest.username);
  }

  //function register forms control in view
  get formControls() { return this.formGuest.controls; }
  // get values
  get pin() {
    return this.formGuest.get('pin');
  }
  get pwConfirm() {
    return this.formGuest.get('pinConfirm');
  }

}
