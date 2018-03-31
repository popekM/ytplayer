import { Component, OnInit } from '@angular/core';

// this component 'owns' components to manage playlists
@Component({
  selector: 'app-playlists',
  template: `

    <app-displayplaylists><app-addplaylist></app-addplaylist></app-displayplaylists>
    <app-displaytracks></app-displaytracks>
  `,
  styles: [`
    :host(){
      float:left;
      padding: 20px;
    }
    app-displayplaylists {
      display: block;
      width: 640px;
      background: black;
      float: right;
    }
    app-displaytracks{
      display: block;
      width: 900px;
      float: right;
    }

  `]
})
export class PlaylistsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
