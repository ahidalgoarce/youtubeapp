import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs'
import { Observable } from 'rxjs';
import { Guest } from '../lib/guest';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  //User URL API
  private guestURL = 'http://localhost:3000/api/guest';
  constructor(private http: HttpClient) { }

  //add new guest to db
  //@guest -> object to front-end
  addGuest(guest: Guest) {
    return this.http.post(`${this.guestURL}`, guest, this.getToken()).pipe(
      catchError(this.handleError)
    );
  }
  //update guest
  //@guest -> object from front-end
  //@id -> id from front-end
  updateGuest(guest: Guest, id: string) {
    let url = `${this.guestURL}/${id}`;
    if (guest.pin != "0000") {
      url = `${this.guestURL}/pin/${id}`;
    }
    return this.http.put(url, guest, this.getToken()).pipe(
      catchError(this.handleError)
    );
  }
  //get all guest
  getGuest(): Observable<Guest[]> {
    return this.http.get<Guest[]>(this.guestURL,this.getToken()).pipe(
        catchError(this.handleError)
      );
  }
  //get guest by id
  //@id -> id from front-end
  getGuestById(id: string): Observable<{}> {
    const url = `${this.guestURL}/${id}`;
    return this.http.get<Guest>(url, this.getToken()).pipe(
      catchError(error => Observable.throw(error))
    );
  }
  //delete guest 
  //@id -> id from front-end 
  deleteGuest(id: string): Observable<{}> {
    const url = `${this.guestURL}/${id}`;
    return this.http.delete(url, this.getToken()).pipe(
      catchError(error => Observable.throw(error))
    );
  }
  //get backed erros
  //@HttpErrorResponse -> angular error object
  private handleError(error: HttpErrorResponse) {
    let msj: string;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was : ${error.error}` +
        `status was : ${error.status}` +
        `headers was : ${error.headers}` +
        `text was : ${error.statusText}`);

    }
    if (error.error.message == undefined) {
      msj = error.error.error;
    } else {
      msj = error.error.message;
    }
    console.log(error);
    // return an observable with a user-facing error message
    return throwError(
      `hubo un error al procesar la solicitud, detalles "${msj}", pudes ver más detalles enla consola.`);
  };

  getToken(){
     const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` 
      })
    }
    return httpOptions;
  }
}
