import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { compareValidator } from '../shared/confirm-equal-validator.directive';
import { GuestService } from '../services/guest.service';
import { Guest } from '../lib/guest';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-frm-guest',
  templateUrl: './frm-guest.component.html',
  styleUrls: ['./frm-guest.component.css']
})
export class FrmGuestComponent implements OnInit {

  private guest: any;
  formGuest: FormGroup;
  submitted = false;

  constructor(private guestService: GuestService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.buildingForms(this.route.snapshot.paramMap.get('id'));
  }


  //function save guest
  // @guest -> object type array
  saveGuest(guest: Guest): void {
    this.guestService.addGuest(guest).subscribe({
      next: response => this.buildObjectGuest(response),
      error: error => this.toastr.error(error, "Error !!"),
      complete: () => this.router.navigate(['/invitados']),
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

  //function update guest
  // @guest -> object type array
  updateGuest(guest: Guest): void {
    this.guestService.updateGuest(guest, guest._id).subscribe({
      next: response => { this.buildObjectGuest(response) },
      error: error => this.toastr.error(error, "Error !!"),
      complete: () => { this.router.navigate(['/invitados']) },
    });
  }
  //function save and update guest
  onSubmit() {
    this.submitted = true;
    if (this.formGuest.status != 'INVALID') {
      this.guest = {
        "_id": this.route.snapshot.paramMap.get('id') !== null ? this.route.snapshot.paramMap.get('id') : null,
        "fullname": this.formGuest.value.fullname,
        "age": this.formGuest.value.age,
        "username": this.formGuest.value.username,
        "pin": this.formGuest.value.pin
      };
      if (this.route.snapshot.paramMap.get('id') === null) {
        this.saveGuest(this.guest);
      } else {
        this.updateGuest(this.guest);
      }
    } else {
      this.toastr.error("Errores en el formulario", "Error !!")
    }
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
  buildFormToSave(): void {
    this.formGuest = this.formBuilder.group({
      fullname: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1), Validators.max(17)]],
      username: ['', Validators.required],
      pin: ['', [Validators.required]],
      pinConfirm: ['', [Validators.required, compareValidator('pin')]]
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

  //Crate validations
  buildingForms(id: any): void {
    if (id === null) {
      this.buildFormToSave();
    } else {
      this.buildFormToUpdate();
      this.getGuestById(this.route.snapshot.paramMap.get('id'));
    }
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
