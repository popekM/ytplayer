import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../provider.service';

@Component({
  selector: 'app-selectplaylist',
  template: `
  <h2 (click)="dis()">
    Playlists:
  </h2>
  <ul>

  <mat-form-field>
    <mat-select [value]="activePlaylist.name" (change)="changePlaylist($event)">
      <mat-option *ngFor="let i of playlists" [value]="i.name">{{i.name}}</mat-option>
    </mat-select>
  </mat-form-field>

  `,
  styles: [`
    :host() {
      display: block;
      margin: 15px;
      padding: 15px;
      border: 1px solid rgb(156, 179, 14);
    }
    a {
      border-left: 5px solid red;
    }
    span {
      color: rgba(255, 255, 255, 0.3)
    }
    .active {
      background: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class SelectplaylistComponent implements OnInit {

  playlists: any[];
  activePlaylist: any;

  constructor(private provider: ProviderService) { }

  ngOnInit() {
    this.playlists = this.provider.getPlaylists();
    this.provider.getActivePlaylist().subscribe((response)=>{
      this.activePlaylist = response;
    });
  }

  changePlaylist(pl) {
    let f = this.playlists.find(playlists => playlists.name === pl.value);
    this.provider.changeActivePlaylist(f);
  }

}
