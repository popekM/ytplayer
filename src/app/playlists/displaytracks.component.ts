import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../provider.service';

@Component({
  selector: 'app-displaytracks',
  template: `
    <h2 [style.backgroundColor]="playlist.color">
      {{ playlist.name }}:
    </h2>

    <mat-toolbar *ngIf="playlist.tracks.length!=0">
      <mat-toolbar-row *ngFor="let i of playlist.tracks; let j =index">
        <span class="title">{{ i.title }}</span>
        <span class="spacer"></span>

        <i class="material-icons" (click)="moveTop(i)" [class.dark]="j<2">vertical_align_top</i>
        <i class="material-icons" (click)="moveUp(i)" [class.dark]="j==0">arrow_upward</i>
        <i class="material-icons" (click)="moveDown(i)" [class.dark]="j==playlist.tracks.length-1" >arrow_downward</i>
        <i class="material-icons" (click)="moveBottom(i)" [class.dark]="j>=(playlist.tracks.length-2)">vertical_align_bottom</i>
        <i class="material-icons" (click)="delete(i)">delete</i>
      </mat-toolbar-row>
    </mat-toolbar>
  `,
  styles: [`
    h2 {
      margin: 0;
      padding: 20px;
    }

    i {
      color: #808080;
      cursor: pointer;
    }
    i:hover:not(.dark){
      color: #fff;
    }
    span {
      color: #fff;
      font-size: 16px;
    }
    .title{
      max-width: 500px;
      overflow: hidden;
    }
    .material-icons {
      padding: 0 6px;
    }

  .spacer {
    flex: 1 1 auto;
  }

    .dark{
      color: #373737;
      cursor: default;
    }
    mat-toolbar-row{
      background: #000;
    }
    @media only screen and (max-width: 550px) {
      .material-icons {
        font-size: 18px;
        padding: 0 2px;
      }
    }
  `]
})
export class DisplaytracksComponent implements OnInit {

  playlist: any[];

  constructor(private provider: ProviderService) { }

  ngOnInit() {
    this.provider.getActivePlaylist().subscribe((response) => {
      this.playlist = response;
    });
  }

  moveTop(i) {
    this.provider.manageTracks(i, 0);
  }

  moveUp(i){
    this.provider.manageTracks(i, 1);
  }

  moveDown(i){
    this.provider.manageTracks(i, 2);
  }

  moveBottom(i) {
    this.provider.manageTracks(i, 3);
  }

  delete(i){
    this.provider.manageTracks(i, 4);
  }
}
