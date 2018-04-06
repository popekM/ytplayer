import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../provider.service';

@Component({
  selector: 'app-selecttrack',
  template: `
  <mat-toolbar
    *ngIf="playlist.tracks.length!=0"
    [style.height.px]="windowSize.elHeight"
    [style.width.px]="scrollBar.display?windowSize.elWidth-20:windowSize.elWidth"
    (wheel)="scroolEvent($event)">

    <mat-toolbar-row *ngFor="let i of songIdToDisplay" (click)="playSong(playlist.tracks[i].id)" [class.active]="playlist.tracks[i].id === idActive">
      <img [src]="playlist.tracks[i].thumbnails.default.url" alt="Thumbnail">
      <span>{{ playlist.tracks[i].title }}</span>
    </mat-toolbar-row>
  </mat-toolbar>
  <div
    *ngIf="scrollBar.display"
    class="scroolbar"
    (click)="changeDisplayedSongs($event)"
    (mousemove)="changeDisplayedSongsMove($event)"
    [style.height.px]="windowSize.elHeight">

    <div class="pointer" [style.top.px]="scrollBar.top" [style.height.px]="scrollBar.height"></div>
  </div>
  `,
  styles: [`
    mat-toolbar{
      float: left;
      overflow: hidden;
    }
    .scroolbar {
      width: 20px;
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
      cursor: pointer;
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

  windowSize = {
    width: 0,
    height: 0,
    top: 0,
    elHeight: 0,
    elWidth: 0
  };
  playlist: any = {
    tracks: []
  }
  songIdToDisplay: number[] = [];
  idActive: string = '';
  scrollBar: any = {
    index: 0,
    display: false,
    height: 20,
    top: 0,
    maxSongs: 10,
    scrollBarHeight: 0,
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

    this.windowSize.height = window.innerHeight;
    this.windowSize.width = window.innerWidth;
    if(this.windowSize.width>599){
      this.windowSize.top = 64;
    }else{
      this.windowSize.top = 56;
    }
      this.windowSize.elHeight = this.windowSize.height - this.windowSize.top - 75;

    if(this.windowSize.width>700){
      this.windowSize.elWidth = 380;
    }else{
      this.windowSize.elWidth = 320;
      if(this.windowSize.elHeight>375){
        this.windowSize.elHeight -=150;
      }
    }
    this.scrollBar.scrollBarHeight =   this.windowSize.elHeight;
    this.scrollBar.maxSongs = Math.ceil(  this.windowSize.elHeight / 64);
    if(this.scrollBar.maxSongs<9){
      this.scrollBar.maxSongs = Math.ceil(  this.windowSize.elHeight / 50);
    }

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
    if(e.pageY && !e.deltaY){
      console.log('pagey', e);
      let fromTop = e.pageY-139;
      let step = this.scrollBar.scrollBarHeight/this.playlist.tracks.length;
      index = Math.floor(fromTop/step);
    }else if(e.deltaY){
      if(e.deltaY>0){
        console.log('plus', this.scrollBar.index);
        index=this.scrollBar.index + 1;
      }else{
        index=this.scrollBar.index - 1;
      }
      console.log(index);
    }else{
      index = e;
    }
    let up = Math.floor((this.scrollBar.maxSongs-1)/2);
    let down = Math.ceil((this.scrollBar.maxSongs-1)/2);

    if(!e.deltaY){
      if(index-up < 0){
        index = 0;
        console.log('zerujemy');
      }else if (index+down+1>this.playlist.tracks.length){
        index = this.playlist.tracks.length-this.scrollBar.maxSongs;
      }else{
        index = index-up;
      }
    }else{
      if(index<0){
        index=0;
      }else if(index+this.scrollBar.maxSongs>this.playlist.tracks.length){
        console.log('aaa');
        index=this.playlist.tracks.length-this.scrollBar.maxSongs;
      }
    }
    //  console.log('pageY: ', e.pageY, ' fromtop: ', fromTop, ' length: ', this.playlist.tracks.length, ' height: ', this.scrollBar.height, ' step: ', step, ' index: ', index);
    console.log('ii', index);
    this.scrollBar.index = index;
    this.updateSongIdToDisplay(index);
    this.scrollBar.calcOffset(index, this.playlist.tracks.length);
  }

  changeDisplayedSongsMove(e){
    if(e.buttons){
      this.changeDisplayedSongs(e);
    }
  }

  scroolEvent(e) {
    e.preventDefault();
    if(this.scrollBar.display){
      console.log();
      this.changeDisplayedSongs(e);
    }
  }
}
