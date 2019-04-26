import { Component, OnInit, NgZone } from '@angular/core'; 
import { Playlist } from '../../app/lib/playlist'
import { ToastrService } from 'ngx-toastr';
import { PlaylistService } from '../services/playlist.service';
import { EventTargetLike } from 'rxjs/internal/observable/fromEvent';

@Component({
  selector: 'app-playlist-admin',
  templateUrl: './playlist-admin.component.html',
  styleUrls: ['./playlist-admin.component.css']
})
export class PlaylistAdminComponent implements OnInit {

  YTsnippet:any = [];
  playlist: Playlist[];
  private API = 'AIzaSyDQFJdLinZ94oC6GJD3s_IuxhBJuPRgtjM';

  constructor(private playlistServicio: PlaylistService,
              private toastr: ToastrService) {}

  ngOnInit(){
    this.getVideos();
  }
  // crud methods
  //get all videos
  getVideos(): void {
    this.playlistServicio.getPlaylistAdmin().subscribe({
      next: response => { this.buildVideos(response), this.toastr.success('Videos cargados', 'Exito!!')},
      error: error => this.toastr.error(error, "Error !!"),
      complete: () => {},
    });
  }
  //get all videos
  getVideosByname(name:string): void {
    this.playlistServicio.getPlaylistAdminByName(name).subscribe({
      next: response => { this.buildVideos(response), this.toastr.success('Videos cargados', 'Exito!!')},
      error: error => this.toastr.error(error, "Error !!"),
      complete: () => {},
    });
  }
  //delete video
  deleteVideo(id:string): void {
    this.playlistServicio.deleteVideo(id).subscribe({
      next: response => { this.buildVideos(response), this.toastr.success('Videos cargados', 'Exito!!')},
      error: error => this.toastr.error(error, "Error !!"),
      complete: () => {},
    });
  }

  // build dom videos
  buildVideos(videos){ 
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

  //seach items
  applyFilter(event, value:string){
    if (event.key === "Enter") {
     this.getVideosByname(value);
    }
  }

}
