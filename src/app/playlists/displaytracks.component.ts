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
      <mat-toolbar-row *ngFor="let i of playlist.tracks">
        <span>{{ i.title }}</span>
        <span class="example-spacer"></span>
        <span>{{ i.duration }}</span>

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
    .example-spacer {
      flex: 1 1 auto;
    }
    h2 {
      display: block;
      width: 100%;
    }
  `]
})
export class DisplaytracksComponent implements OnInit {

  playlist: any[];

  constructor(private provider: ProviderService) { }

  ngOnInit() {
    this.provider.getActivePlaylist().subscribe((response)=>{
      this.playlist = response;
    });
  }
}
