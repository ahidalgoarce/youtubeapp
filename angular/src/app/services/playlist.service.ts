import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs'
import { Observable } from 'rxjs';
import { Playlist } from '../lib/playlist';

@Injectable({
  providedIn: 'root'
})

export class PlaylistService {

  //Video URL API
  private playlistURL = 'http://localhost:3000/api/playlist';

  constructor(private http: HttpClient) { }


  //add new video to db
  //@video -> object to front-end
  addPlaylist(playlist: Playlist) {
    return this.http.post(`${this.playlistURL}`, playlist, this.getToken()).pipe(
      catchError(this.handleError)
    );
  }

  //get videos guest
  getPlaylistGuest(): Observable<Playlist[]> {
    const url = `${this.playlistURL}/guest`;
    return this.http.get<Playlist[]>(url, this.getToken()).
      pipe(
        catchError(this.handleError)
      );
  }

   //get videos guest
   getPlaylist(id:string): Observable<Playlist[]> {
    const url = `${this.playlistURL}/${id}`;
    return this.http.get<Playlist[]>(url, this.getToken()).
      pipe(
        catchError(this.handleError)
      );
  }

  //get all videos by role
  getPlaylistAdmin(): Observable<Playlist[]> {
    const url = `${this.playlistURL}/admin`;
    return this.http.get<Playlist[]>(url, this.getToken()).
      pipe(
        catchError(this.handleError)
      );
  }
  //get all videos by role and name
  getPlaylistAdminByName(name:string): Observable<Playlist[]> {
    const url = `${this.playlistURL}/admin/${name}`;
    return this.http.get<Playlist[]>(url, this.getToken()).
      pipe(
        catchError(this.handleError)
      );
  }
  //get all videos by role and name
  getPlaylistGuestByName(name:string): Observable<Playlist[]> {
    const url = `${this.playlistURL}/guest/${name}`;
    return this.http.get<Playlist[]>(url, this.getToken()).
      pipe(
        catchError(this.handleError)
      );
  }

  //delete guest 
  //@id -> id from front-end 
  deleteVideo(id: string): Observable<{}> {
    const url = `${this.playlistURL}/${id}`;
    return this.http.delete(url, this.getToken()).pipe(
      catchError(error => Observable.throw(error))
    );
  }
  //delete guest 
  //@id -> id from front-end 
  getVideoById(id: string): Observable<{}> {
    const url = `${this.playlistURL}/${id}`;
    return this.http.get<Playlist>(url, this.getToken()).pipe(
      catchError(error => Observable.throw(error))
    );
  }

  //update video
  //@video -> object from front-end
  //@id -> id from front-end
  updatePlaylist(playlist: Playlist, id: string) {
    const url = `${this.playlistURL}/${id}`;
    return this.http.put(url, playlist, this.getToken()).pipe(
      catchError(this.handleError)
    );
  }


  getToken() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
      })
    };
    return httpOptions;
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
}
