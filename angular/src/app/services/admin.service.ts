import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs'
import { Observable } from 'rxjs';
import { User } from '../lib/user';

@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  
  //User URL API
  private userURL = 'http://localhost:3000/api/users';
  
  constructor(private http: HttpClient) { }


  //add new user to db
  //@user -> object to front-end
  addUser(user: User) {
    return this.http.post(`${this.userURL}`,user, this.getToken()).pipe(
      catchError(this.handleError)
    );
  }
  //update user
  //@user -> object from front-end
  //@id -> id from front-end
  updateUser(user: User) {
    let url = `${this.userURL}`; 
    if(user.password != "000000"){
      url = `${this.userURL}/password`;
    }
    return this.http.put(url, user, this.getToken()).pipe(
      catchError(this.handleError)
    );
  }
  //ge all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userURL, this.getToken()).
      pipe(
        catchError(this.handleError)
      );
  }
  //get user by id
  //@id -> id from front-end
  getUserById(): Observable<{}> {
    let url = `${this.userURL}/id`; 
    return this.http.get<User>(url, this.getToken()).pipe(
      catchError(error => Observable.throw(error))
    );
  }
  //delete user 
  //@id -> id from front-end 
  deleteUser(id: string): Observable<{}> {
    const url = `${this.userURL}/${id}`;
    return this.http.delete(url, this.getToken()).pipe(
      catchError(error => Observable.throw(error))
    );
  }
  //get backed erros
  //@HttpErrorResponse -> angular error object
  private handleError(error: HttpErrorResponse) {
    let msj : string;
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
      if(error.error.message == undefined){
        msj = error.error.error;
      }else{
        msj = error.error.message;
      }
      console.log(error);
    // return an observable with a user-facing error message
    return throwError(
      `hubo un error al procesar la solicitud, detalles "${msj}", pudes ver más detalles enla consola.`);
  };

  getToken(){
    //Header backend
    const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` 
    })
  };
  return httpOptions;
  }
}
