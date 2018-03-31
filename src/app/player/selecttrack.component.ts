import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../provider.service';

@Component({
  selector: 'app-selecttrack',
  template: `
  <mat-toolbar *ngIf="playlist.tracks.length!=0" [style.width.px]="scrollBar.display?360:380">
    <mat-toolbar-row *ngFor="let i of songIdToDisplay" (click)="playSong(playlist.tracks[i].id)" [class.active]="playlist.tracks[i].id === idActive">
      <img [src]="playlist.tracks[i].thumbnails.default.url" alt="Thumbnail">
      <span>{{ playlist.tracks[i].title }}</span>
    </mat-toolbar-row>
  </mat-toolbar>
  <div *ngIf="scrollBar.display" class="scroolbar" (click)="changeDisplayedSongs($event)" (mousemove)="changeDisplayedSongsMove($event)">
    <div class="pointer" [style.top.px]="scrollBar.top" [style.height.px]="scrollBar.height"></div>
  </div>
  `,
  styles: [`
    mat-toolbar{
      float: left;
      height: 670px;
      overflow: hidden;
    }
    .scroolbar {
      width: 20px;
      height: 670px;
      float: left;
      background: rgb(62, 62, 62)
    }
    .scroolbar .pointer {
      position: relative;
      top: 20px;
      width: 20px;
      height: 50px;
      background: rgb(112, 112, 112)
    }
    .scroolbar .pointer:hover{
      background: #c2185b;
      cursor: grab;
    }
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

  playlist: any = {
    tracks: []
  }
  songIdToDisplay: number[] = [];
  idActive: string = '';
  scrollBar: any = {
    display: false,
    height: 20,
    top: 0,
    maxSongs: 10,
    scrollBarHeight: 670,
    calcHeight: function(len) {
      this.height = Math.floor(this.maxSongs/len*this.scrollBarHeight);
      console.log('height', this.height);
    },
    defineDisplay: function(pl) {
      if(pl.tracks.length>this.maxSongs){
        this.display = true;
        this.calcHeight(pl.tracks.length);
      }else{
        this.display = false;
      }
    },
    calcOffset: function(i, l){
      let end = this.scrollBarHeight-this.height;
      let temp = l - this.maxSongs;
      let step = end/temp;
      this.top = step * i;
    }
  }

  constructor(private provider: ProviderService) { }

  ngOnInit() {
    this.updateSongIdToDisplay(0);
    this.provider.getActivePlaylist().subscribe((response)=>{
      this.playlist = response;
      this.scrollBar.defineDisplay(this.playlist);
      this.updateSongIdToDisplay(0);
    });
    this.provider.getSongsToPlay().subscribe((response) => {
      this.idActive = <string>response;
      let index = this.playlist.tracks.findIndex(i => this.idActive === i.id);
      let indexA = this.songIdToDisplay.findIndex(i => index === i);
      if(indexA===(-1)){
        this.changeDisplayedSongs(index);
      }
    });
  }

  playSong(id){
    this.provider.playSong(id);
    this.idActive = id;
  }
  updateSongIdToDisplay(start){
    let length;
    if(this.playlist.tracks.length>this.scrollBar.maxSongs){
      length=this.scrollBar.maxSongs;
    }else{
      length=this.playlist.tracks.length;
    }
    this.songIdToDisplay = [];
    for(let i=0; i<length; i++){
      this.songIdToDisplay[i]=start++;
    }
  }

  changeDisplayedSongs(e){
    let index;
    if(e.pageY){
      let fromTop = e.pageY-139;
      let step = this.scrollBar.scrollBarHeight/this.playlist.tracks.length;
      index = Math.floor(fromTop/step);
    }else{
      index = e;
    }
    let up = Math.floor((this.scrollBar.maxSongs-1)/2);
    let down = Math.ceil((this.scrollBar.maxSongs-1)/2);
    if(index-up < 0){
      index = 0;
    }else if (index+down+1>this.playlist.tracks.length){
      index = this.playlist.tracks.length-this.scrollBar.maxSongs;
    }else{
      index = index-up;
    }
    //  console.log('pageY: ', e.pageY, ' fromtop: ', fromTop, ' length: ', this.playlist.tracks.length, ' height: ', this.scrollBar.height, ' step: ', step, ' index: ', index);
    this.updateSongIdToDisplay(index);
    this.scrollBar.calcOffset(index, this.playlist.tracks.length);
  }

  changeDisplayedSongsMove(e){
    if(e.buttons){
      this.changeDisplayedSongs(e);
    }
}
