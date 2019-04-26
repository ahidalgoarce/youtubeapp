import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './/app-routing.module';
import { MaterialModule } from './material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';
import { JwtModule } from '@auth0/angular-jwt';
import { CompareValidatorModule } from 'angular-compare-validator';

//externals class
import { FrmAdminComponent } from './frm-admin/frm-admin.component';
import { TableGuestComponent } from './table-guest/table-guest.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { FrmGuestComponent } from './frm-guest/frm-guest.component';
import { PlaylistAdminComponent } from './playlist-admin/playlist-admin.component';
import { VideoComponent } from './video/video.component';
import { PlaylistGuestComponent } from './playlist-guest/playlist-guest.component';
import { LoginGuestComponent } from './login-guest/login-guest.component';
import { FrmPlaylistComponent } from './frm-playlist/frm-playlist.component';
import { FrmVerifiedComponent } from './frm-verified/frm-verified.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { DeleteGuestComponent } from './delete-guest/delete-guest.component';
import { DeletePlaylistComponent } from './delete-playlist/delete-playlist.component';
import { HomeComponent } from './home/home.component';

// get token from session storange
export function tokenGetter() {
  return localStorage.getItem('access_token');
}



@NgModule({
  declarations: [
    AppComponent,
    FrmAdminComponent,
    TableGuestComponent,
    LoginAdminComponent,
    FrmGuestComponent,
    PlaylistAdminComponent,
    VideoComponent,
    PlaylistGuestComponent,
    LoginGuestComponent,
    FrmPlaylistComponent,
    FrmVerifiedComponent,
    UpdateProfileComponent,
    DeleteGuestComponent,
    DeletePlaylistComponent,
    HomeComponent
  ],
  imports: [
    CompareValidatorModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:4000'],
        blacklistedRoutes: ['localhost:4000/api/auth']
      }
    }), 
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    HttpModule,
    
  ],
  providers: [ 
    AuthService,
    AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
