import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { CommonModule } from '@angular/common';
//componentUser
// root compoent
import { AppComponent } from './app.component'

// user components
import { FrmAdminComponent } from './frm-admin/frm-admin.component';
import { TableGuestComponent } from './table-guest/table-guest.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { FrmGuestComponent } from './frm-guest/frm-guest.component';
import { FrmVerifiedComponent } from './frm-verified/frm-verified.component';
import { FrmPlaylistComponent } from './frm-playlist/frm-playlist.component';
import { PlaylistAdminComponent } from './playlist-admin/playlist-admin.component';
import { PlaylistGuestComponent } from './playlist-guest/playlist-guest.component';
import { LoginGuestComponent } from './login-guest/login-guest.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { VideoComponent } from './video/video.component';
import { DeleteGuestComponent } from './delete-guest/delete-guest.component';
import { DeletePlaylistComponent } from './delete-playlist/delete-playlist.component';
import { HomeComponent } from './home/home.component';




const routes: Routes = [
  // root route
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  //playlist routes
   { path: 'mis-videos', component: PlaylistGuestComponent, canActivate: [AuthGuard] },
   { path: 'ver/:id', component: VideoComponent, canActivate: [AuthGuard] },
   { path: 'administrar-videos', component: PlaylistAdminComponent, canActivate: [AuthGuard] },
   { path: 'nuevo-video', component: FrmPlaylistComponent, canActivate: [AuthGuard] },
   { path: 'actualizar-video/:id', component: FrmPlaylistComponent, canActivate: [AuthGuard] },
   { path: 'eliminar-video/:id', component: DeletePlaylistComponent, canActivate: [AuthGuard] },
  // { path: 'actualizar-video', component: FormVideoComponent, canActivate: [AuthGuard] },
  // // user routes
  // { path: 'usuarios', component: UsersComponent,canActivate: [AuthGuard] },
  { path: 'registrarse', component: FrmAdminComponent },
  { path: 'actualizar/mi-perfil', component: UpdateProfileComponent,canActivate: [AuthGuard] },
  // guest routes
   { path: 'invitados', component: TableGuestComponent},
   { path: 'nuevo-invitado', component: FrmGuestComponent,canActivate: [AuthGuard] },
   { path: 'actualizar-invitado/:id', component: FrmGuestComponent,canActivate: [AuthGuard]},
   { path: 'eliminar-invitado/:id', component: DeleteGuestComponent,canActivate: [AuthGuard]},
   // // logis routes
   { path: 'login-admin', component: LoginAdminComponent},
   { path: 'login-invitado', component: LoginGuestComponent},
   { path: 'verificar-usuario/:id', component: FrmVerifiedComponent},
  // home routes
  { path: 'inicio', component: HomeComponent},
  
]


@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule {


  
 }
