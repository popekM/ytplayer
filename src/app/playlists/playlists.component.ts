import { Component, OnInit } from '@angular/core';

// this component 'owns' components to manage playlists
@Component({
  selector: 'app-playlists',
  template: `

    <app-displayplaylists [style.width.px]="elWidth" [style.margin.px]="margin"><app-addplaylist></app-addplaylist></app-displayplaylists>
    <app-displaytracks [style.width.px]="elWidth" [style.margin.px]="margin"></app-displaytracks>
  `,
  styles: [`
    :host(){
      float:left;
    }
    app-displayplaylists {
      display: block;
      background: black;
      float: right;
    }
    app-displaytracks{
      display: block;
      float: right;
    }

  `]
})
export class PlaylistsComponent implements OnInit {

  elWidth = 0;
  margin = 0;
  elHeight = 0;
  constructor() { }

  ngOnInit() {
    this.elWidth = Math.floor((window.innerWidth - 100) / 2);
    this.margin = 20;
    if(this.elWidth<380){
      this.elWidth = window.innerWidth;
      this.margin = 0;
    }
  }

}
