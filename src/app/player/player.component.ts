import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  displayTracks = false;
  constructor() { }

  ngOnInit() {
    this.windowSize.height = window.innerHeight;
    this.windowSize.width = window.innerWidth;
    if(this.windowSize.width>599){
      this.windowSize.top = 64;
    }else{
      this.windowSize.top = 56;
    }
    if((this.windowSize.height - this.windowSize.top)>375){
      this.windowSize.bottom = 150;
    }
  }

  windowSize = {
    width: 0,
    height: 0,
    top: 0,
    bottom: 0
  }

  toggleTrackList() {
    this.displayTracks=!this.displayTracks;
  }
}
