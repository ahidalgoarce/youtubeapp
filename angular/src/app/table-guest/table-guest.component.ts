import { Component, OnInit, ViewChild } from '@angular/core';
import { GuestService} from '../services/guest.service';
import { Guest} from '../lib/guest'
import { ToastrService } from 'ngx-toastr';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material'

@Component({
  selector: 'app-table-guest',
  templateUrl: './table-guest.component.html',
  styleUrls: ['./table-guest.component.css']
})
export class TableGuestComponent implements OnInit {
  
  private guests: Guest[];   
  displayedColumns: string[] = ['nombre', 'usuario', 'edad', 'acciones'];
  dataSource: MatTableDataSource<Guest>;
  private positon = 0;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 
  constructor(private guestService: GuestService, 
              private toastr: ToastrService){ 
              this.dataSource = new MatTableDataSource([]);
              this.getProducts();
              }

  ngOnInit():void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //get users
  getGuests(): void {
    this.guestService.getGuest().subscribe({
      next: guests => this.guests = guests,
      error: error => this.toastr.error(error, "Error !!"),
      complete: () => this.dataSource = new MatTableDataSource<Guest>(this.guests),
    });
  }
  //create datatable
  getProducts() {
    this.guestService.getGuest().subscribe(
      response => { this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      })}
  //datatable filter items
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}


