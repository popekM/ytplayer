import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../provider.service';

@Component({
  selector: 'app-selecttrack',
  template: `
  <h2 [style.backgroundColor]="playlist.color">
    {{ playlist.name }}
  </h2>
  <ul>
  <mat-toolbar *ngIf="playlist.tracks.length!=0">
    <mat-toolbar-row *ngFor="let i of playlist.tracks" (click)="playSong(i.id)">
      <span>{{ i.title }}</span>
      <span class="example-spacer"></span>
      <span>{{ i.duration }}</span>

    </mat-toolbar-row>
  </mat-toolbar>
  `,
  styles: []
})
export class SelecttrackComponent implements OnInit {

  playlist: any[];

  constructor(private provider: ProviderService) { }

  ngOnInit() {
    this.provider.getActivePlaylist().subscribe((response)=>{
      this.playlist = response;
    });
  }

  playSong(id){
    this.provider.playSong(id);
    console.log('wyslano do providera', id);
  }
}
