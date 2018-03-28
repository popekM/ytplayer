import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import {
  MatButtonModule,
  MatButtonToggleModule,
  MatListModule,
  MatToolbarModule,
  MatInputModule,
  MatCardModule,
  MatMenuModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { ProviderService } from './provider.service';
import { PlaylistsComponent } from './playlists/playlists.component';
import { AddplaylistComponent } from './playlists/addplaylist.component';
import { DisplayplaylistsComponent } from './playlists/displayplaylists.component';
import { DisplaytracksComponent } from './playlists/displaytracks.component';
import { PlayerComponent } from './player/player.component';
import { SelectplaylistComponent } from './player/selectplaylist.component';
import { SelecttrackComponent } from './player/selecttrack.component';
import { SearchformComponent } from './searchform.component';


@NgModule({
  declarations: [
    AppComponent,
    PlaylistsComponent,
    AddplaylistComponent,
    DisplayplaylistsComponent,
    DisplaytracksComponent,
    PlayerComponent,
    SelectplaylistComponent,
    SelecttrackComponent,
    SearchformComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatListModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule
  ],
  providers: [ProviderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
