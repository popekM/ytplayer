import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../provider.service';

@Component({
  selector: 'app-displaytracks',
  template: `
    <h2 [style.backgroundColor]="playlist.color">
      {{ playlist.name }}
    </h2>
    <ul>
    <mat-toolbar *ngIf="playlist.tracks.length!=0">
      <mat-toolbar-row *ngFor="let i of playlist.tracks; let j =index">
        <span>{{ i.title }}</span>
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
    :host() {
      display: block;
      margin: 15px;
      padding: 15px;
      border: 1px solid rgb(19, 186, 215);
    }
    span {
      color: rgba(255, 255, 255, 0.3)
    }
    .material-icons {
  padding: 0 6px;
}

.spacer {
  flex: 1 1 auto;
}    h2 {
      display: block;
      width: 100%;
    }
    .dark{
      color: #373737;
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
