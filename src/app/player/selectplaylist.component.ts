import { Component, OnInit, HostListener } from '@angular/core';
import { ProviderService } from '../provider.service';

@Component({
  selector: 'app-selectplaylist',
  template: `
  <mat-form-field [style.backgroundColor]="activePlaylist.color" [style.width.px]="width>700?340:280">
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
      /deep/ .mat-select-value{
        text-align: center !important;
      }
  `]
})
export class SelectplaylistComponent implements OnInit {
  @HostListener('window:resize')
  onResize() {
    this.width = window.innerWidth;
  }

  playlists: any[] = [];
  activePlaylist: any = '';
  width = 0;
  constructor(private provider: ProviderService) { }

  ngOnInit() {
    this.width = window.innerWidth;
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
