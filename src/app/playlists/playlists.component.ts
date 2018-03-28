import { Component, OnInit } from '@angular/core';

// this component 'owns' components to manage playlists
@Component({
  selector: 'app-playlists',
  template: `
    <app-addplaylist></app-addplaylist>
    <app-displayplaylists></app-displayplaylists>
    <app-displaytracks></app-displaytracks>
  `,
  styles: []
})
export class PlaylistsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
