import { Component, OnInit, HostListener } from '@angular/core';

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
      background: #212121;
    }
    app-displayplaylists {
      display: block;
      background: #000;
      float: right;
    }
    app-displaytracks{
      display: block;
      float: right;
    }
  `]
})
export class PlaylistsComponent implements OnInit {
  @HostListener('window:resize')
  onResize() {
    this.setDimensions();
  }

  elWidth = 0;
  margin = 0;
  elHeight = 0;
  constructor() { }

  ngOnInit() {
    this.setDimensions();
  }

  setDimensions() {
    this.elWidth = Math.floor((window.innerWidth - 100) / 2);
    this.margin = 20;
    if (this.elWidth < 380) {
      this.elWidth = window.innerWidth;
      this.margin = 0;
    }
  }
}
