import { Component, OnInit } from '@angular/core'; 
import { Playlist } from '../../app/lib/playlist'
import { ToastrService } from 'ngx-toastr';
import { PlaylistService } from '../services/playlist.service';

@Component({
  selector: 'app-playlist-guest',
  templateUrl: './playlist-guest.component.html',
  styleUrls: ['./playlist-guest.component.css']
})
export class PlaylistGuestComponent implements OnInit {

  YTsnippet:any = [];
  playlist: Playlist[];
  private API = 'AIzaSyDQFJdLinZ94oC6GJD3s_IuxhBJuPRgtjM';

  constructor(private playlistService: PlaylistService,
              private toastr: ToastrService) {}

  ngOnInit(){
    this.getPlaylist();
  }
  // crud methods
  //get all videos
  getPlaylist(): void {
    this.playlistService.getPlaylistGuest().subscribe({
      next: response =>  this.buildPlaylist(response),
      error: error => this.toastr.error(error, "Error !!"),
      complete: () => this.toastr.success('Videos Cargados', 'Exito!!'),
    });
  }
  // build dom videos
  buildPlaylist(videos){ 
    this.YTsnippet = [];
    for (let index in videos) {
      fetch(`https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=${videos[index].url}&key=${this.API}`)
      .then(response => response.json())
      .then(data => {
        this.YTsnippet.push({data:data.items[0], _id:videos[index]._id, nameVideo:videos[index].name});
      }).catch(err => {
        this.toastr.error('Error al cargar el video', err);
      });
    }
  }
  //get all videos
  getVideosByname(name:string): void {
    this.playlistService.getPlaylistGuestByName(name).subscribe({
      next: response => { this.buildPlaylist(response), this.toastr.success('Videos cargados', 'Exito!!')},
      error: error => this.toastr.error(error, "Error !!"),
      complete: () => {},
    });
  }
  //seach items
  applyFilter(event, value:string){
    if (event.key === "Enter") {
     this.getVideosByname(value);
    }
  }

}
