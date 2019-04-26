import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { PlaylistService } from '../services/playlist.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  private API = 'AIzaSyDQFJdLinZ94oC6GJD3s_IuxhBJuPRgtjM';
  constructor(private route: ActivatedRoute,
    private toastr: ToastrService,
    private playlistService: PlaylistService) { }

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

  //get all videos
  getVideoById(id: string): void {
    this.playlistService.getPlaylist(id).subscribe({
      next: response => { this.builComponents(response), this.toastr.success('Video cargados', 'Exito!!') },
      error: error => this.toastr.error(error, "Error !!"),
      complete: () => { },
    });
  }

  //create video information
  buildVideosInfo(name: string) {
    const h3 = document.createElement('h3');
    h3.textContent = name;
    h3.style.paddingTop = '10px';
    h3.style.paddingBottom = '10px';
    h3.style.paddingLeft = '5px';
    document.getElementById('footer-video').appendChild(h3);

  }
  //create interfaz components
  builComponents(response: any) {
    this.buildVideo(response[0].url);
    this.buildVideosInfo(response[0].name);
  }
}
