import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../provider.service';

@Component({
  selector: 'app-selecttrack',
  template: `
  <mat-toolbar *ngIf="playlist.tracks.length!=0">
    <mat-toolbar-row *ngFor="let i of playlist.tracks" (click)="playSong(i.id)" [class.active]="i.id === idActive">
      <img [src]="i.thumbnails.default.url" alt="Thumbnail">
      <span>{{ i.title }}</span>
    </mat-toolbar-row>
  </mat-toolbar>
  `,
  styles: [`
    mat-toolbar-row {
      height: 64px;
      overflow: hidden;
      font-size: 16px;
      padding: 2px;
    }
    mat-toolbar-row:not(.active):hover {
      background: #313131;
    }
    img {
      width: 80px;
      height: 60px;
      padding-right: 5px;
      position: relative;
    text-align: center;
    color: white;
    }
    .active {
      background: #c2185b;
    }
    `]
})
export class SelecttrackComponent implements OnInit {

  playlist: any[];
  idActive: string = '';

  constructor(private provider: ProviderService) { }

  ngOnInit() {
    this.provider.getActivePlaylist().subscribe((response)=>{
      this.playlist = response;
    });
    this.provider.getSongsToPlay().subscribe((response) => {
      this.idActive = <string>response;
    });
  }

  playSong(id){
    this.provider.playSong(id);
    this.idActive = id;
    console.log('wyslano do providera', id);
  }
}
