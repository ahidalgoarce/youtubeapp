import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Playlist } from '../lib/playlist';
import { Router } from '@angular/router'
import { PlaylistService } from '../services/playlist.service';
import { ActivatedRoute } from '@angular/router';
import { GuestService } from '../services/guest.service';
import { Guest } from '../lib/guest';

@Component({
  selector: 'app-frm-playlist',
  templateUrl: './frm-playlist.component.html',
  styleUrls: ['./frm-playlist.component.css']
})
export class FrmPlaylistComponent implements OnInit {

  videoForm: FormGroup;
  guests: Guest[];
  submitted = false;
  playlist: Playlist;
  

  constructor(private playlistService: PlaylistService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private guestService: GuestService) { }

  ngOnInit() {
    this.buildVideoForm();  
    this.getGuests();
    this.buildInterface(this.route.snapshot.paramMap.get('id'));

  }
  //function save playlist
  // @user -> object type array
  saveUser(playlist: Playlist): void {
    this.playlistService.addPlaylist(playlist).subscribe({
      next: response => {this.router.navigate(['/administrar-videos'])},
      error: error => this.toastr.error(error, "Error X("),
      complete: () => {}
    });
  }
  //get guest
  getGuests(): void {
    this.guestService.getGuest().subscribe({
      next: guests => { this.guests = guests, this.toastr.success('Invitados cargados', 'Exito!!') },
      error: error => this.toastr.error(error, "Error !!"),
      complete: () => { },
    });
  }
  //function save video
  // @video -> object type array
  updateVideo(playlist: Playlist): void {
    this.playlistService.updatePlaylist(playlist, playlist._id).subscribe({
      next: response => this.router.navigate(['/administrar-videos']),
      error: error => this.toastr.error(error, "Error x("),
      complete: () => {}
    });
  }

  //get all videos
  getVideoById(id: string): void {
    this.playlistService.getPlaylist(id).subscribe({
      next: response => { this.playlist = this.buildObjectVideo(response), this.toastr.success('Video cargado', 'Exito!!') },
      error: error => this.toastr.error(error, "Error !!"),
      complete: () => {this.buildFormWithValues(this.playlist)},
    });
  }


  //Build form with validations
  buildVideoForm() {
    this.videoForm = this.formBuilder.group({
      url: ['', [Validators.required, Validators.pattern('^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$')]],
      guest: ['', [Validators.required]],
      name: ['', [Validators.required]]
    });
  }


  //Load items to form
  // @user -> items from database
  buildFormWithValues(playlist: Playlist): void {
    this.videoForm.get('url').setValue(playlist.url);
    this.videoForm.get('guest').setValue(playlist.guest);
    this.videoForm.get('name').setValue(playlist.name);
     }

  //Submit modal
  onSubmit(): void {
    this.submitted = true;
    if (this.videoForm.status != 'INVALID') {
      this.playlist = {
        '_id': this.route.snapshot.paramMap.get('id') !== null ? this.route.snapshot.paramMap.get('id') : null,
        'url': this.YouTubeGetID(this.videoForm.value.url),
        'name': this.videoForm.value.name,
        'guest': this.videoForm.value.guest
      };
      if (this.route.snapshot.paramMap.get('id') === null) {
        this.saveUser(this.playlist);
      } else {
        this.updateVideo(this.playlist);
      }
    } else {
      this.toastr.error("Errores en el formulario", "Error !!")
    }
  }
  //get id from url
  YouTubeGetID(url) {
    var ID = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    }
    else {
      ID = url;
    }
    return ID;
  }
  //builInterface
  buildInterface(id:string){
    if(id !== null){
      this.getVideoById(id);
    }
  }

  //create user object
  buildObjectVideo(response: any): Playlist {
    return this.playlist = {
      "_id": response[0]._id !== undefined ? response[0]._id : '',
      "url": response[0].url !== undefined ? `https://www.youtube.com/watch?v=${response[0].url}` : '',
      'name': response[0].name !== undefined ? response[0].name : '',
      'guest': response[0].guest !== undefined ? response[0].guest: ''
    };
  }
  //admin login controls 
  get formControls() { return this.videoForm.controls; }
  

}
