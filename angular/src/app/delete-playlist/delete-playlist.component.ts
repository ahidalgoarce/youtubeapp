import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PlaylistService } from '../services/playlist.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router'

@Component({
  selector: 'app-delete-playlist',
  templateUrl: './delete-playlist.component.html',
  styleUrls: ['./delete-playlist.component.css']
})
export class DeletePlaylistComponent implements OnInit {

  private API = 'AIzaSyDQFJdLinZ94oC6GJD3s_IuxhBJuPRgtjM';
  private playlist: any;

  constructor(private route: ActivatedRoute,
    private toastr: ToastrService,
    private playlistService: PlaylistService,
    private router: Router) { }

  ngOnInit() {
    this.getVideoById(this.route.snapshot.paramMap.get('id'));
  }

  //create iframe 
  buildVideo(id: string) {
    if (id !== undefined || id !== null) {
      const video = document.createElement('iframe');
      video.src = video.src = `https://www.youtube.com/embed/${id}`;
      video.frameBorder = '0';
      video.allowFullscreen = true;
      video.width = '100%';
      video.height = '100%';
      document.getElementById('videoContainer').appendChild(video);
    }
  }

   //function get  guest by id
    delete(): void {
    this.playlistService.deleteVideo(this.playlist[0]._id).subscribe({
      next: response => this.router.navigate(['/administrar-videos']),
      error: error => this.toastr.error(error, "Error !!"),
      complete: () => { },
    });
  }

  getVideoById(id: string) {
    this.playlistService.getVideoById(id).subscribe({
      next: response => { this.builComponents(response), this.playlist = response, this.toastr.success('Videos cargado', 'Exito!!') },
      error: error => this.toastr.error(error, "Error !!"),
      complete: () => {},
    });
  }


  //create interfaz components
  builComponents(response: any) {
    this.buildVideo(response[0].url);
    this.buildVideosInfo(response[0].name);
  }
  buildVideosInfo(name:string) {
    const h3 = document.createElement('h3');
    h3.textContent = name;
    h3.style.paddingTop = '10px';
    h3.style.paddingBottom = '10px';
    h3.style.paddingLeft = '5px';
    document.getElementById('footer-video').appendChild(h3);
  }
}
