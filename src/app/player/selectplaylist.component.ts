import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../provider.service';

@Component({
  selector: 'app-selectplaylist',
  template: `
  <mat-form-field [style.backgroundColor]="activePlaylist.color">
    <mat-select placeholder="Playlist:" [value]="activePlaylist.name" (change)="changePlaylist($event)">
      <mat-option *ngFor="let i of playlists" [value]="i.name" [style.borderColor]="i.color">{{i.name}}</mat-option>
    </mat-select>
  </mat-form-field>

  `,
  styles: [`
      mat-option {
        border-left: 5px solid;
      }
      mat-form-field {
        padding-top: 10px;
        padding-left: 20px;
        padding-right: 20px;
        width: 340px;
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
