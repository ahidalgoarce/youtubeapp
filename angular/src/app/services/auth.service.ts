import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs'
import { User } from '../lib/user'
import { Guest } from '../lib/guest';;


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any;

  private loginURL = 'http://localhost:3000/api/login';
  constructor(private http: HttpClient) { }
  // loginAdmin(username: string, password: string): Observable<boolean> {
  //   return this.http.post<{token: string}>('/api/auth', {username: username, password: password})
  //     .pipe(
  //       map(result => {
  //         sessionStorage.setItem('access_token', result.token);
  //         return true;
  //       })
  //     );
  // }


  loginUser(user: User) {
    const url = `${this.loginURL}/admin`
    return this.http.post<User>(url, user).pipe(
      catchError(this.handleError)
    );
  }
  loginGuest(guest: Guest) {
    const url = `${this.loginURL}/guest`
    return this.http.post<Guest>(url, guest).pipe(
      catchError(this.handleError)
    );
  }

  verifiedUser(user: User, code:string) {
    const url = `${this.loginURL}/verified/${code}`
    return this.http.post<User>(url, user).pipe(
      catchError(this.handleError)
    );
  }

  logout() {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('fullname');
  }

  public get loggedIn(): boolean {
    return (sessionStorage.getItem('access_token') !== null);
  }
  public get fullname(): string {
    return sessionStorage.getItem('fullname') !== null ? sessionStorage.getItem('fullname') : '';
  }
  public get admin(): boolean {
    return (sessionStorage.getItem('role') === 'admin');
  }

   public get guest(): boolean {
    return (sessionStorage.getItem('role') === 'guest');
  }
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
}
