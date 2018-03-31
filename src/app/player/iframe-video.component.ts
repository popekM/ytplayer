import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../provider.service';

@Component({
  selector: 'app-iframe-video',
  template: `
    <div class="vinyl" *ngIf="playerSettings.vinyl">
      <img src="./assets/vinyl.png" alt="vinyl">
      <img class="thumbnail" [src]="songThumbnailH" alt="thumbnail">
    </div>
    <div id="player"></div>
    <div class="controls">

    <mat-grid-list cols="8" rowHeight="74px">

      <mat-grid-tile colspan="1" rowspan="2">
        <img [src]="songThumbnail" alt="thumbnail">
      </mat-grid-tile>

      <mat-grid-tile colspan="1" rowspan="2">
        {{songTitle}}
      </mat-grid-tile>

      <mat-grid-tile colspan="4" rowspan="1">
        <i class="material-icons" (click)="playPreviousSong()" [class.dark]="history.length==0">skip_previous</i>
        <i class="material-icons big" (click)="playVideo()" *ngIf="!playerState.inPlay">play_arrow</i>
        <i class="material-icons big" (click)="pauseVideo()" *ngIf="playerState.inPlay">pause</i>
        <i class="material-icons" (click)="playNextSong()">skip_next</i>
      </mat-grid-tile>

      <mat-grid-tile colspan="2" rowspan="2">
        <i class="material-icons small" (click)="toggleRandom()" [class.active]="playerSettings.randomPlay">shuffle</i>
        <i class="material-icons small" (click)="toggleRepeat()" *ngIf="playerSettings.repeatMode!==2" [class.active]="playerSettings.repeatMode">repeat</i>
        <i class="material-icons small" (click)="toggleRepeat()" *ngIf="playerSettings.repeatMode===2" [class.active]="playerSettings.repeatMode">repeat_one</i>
        <span class="spacer">&nbsp;</span>
        <i class="material-icons small active volume" *ngIf="playerState.volume===0" (click)="setVolume(10)">volume_off</i>
        <i class="material-icons small volume" *ngIf="playerState.volume!==0" (click)="setVolume(0)">volume_mute</i>
        <mat-slider thumbLabel min="0" max="100" step="1" [(ngModel)]="playerState.volume" (click)="setVolume(playerState.volume)"></mat-slider>
        <i class="material-icons small volume" (click)="setVolume(100)" [class.active]="playerState.volume===100">volume_up</i>
        <span class="spacer">&nbsp;</span>
        <i class="material-icons small" (click)="toggleVinyl()" [class.active]="playerSettings.vinyl">album</i>
      </mat-grid-tile>

      <mat-grid-tile colspan="4" rowspan="1">
        <mat-slider class="progressbar" min="0" max="{{duration.value}}" step="1" [(ngModel)]="duration.current" (click)="rewindVideo(duration.current)"></mat-slider>
      </mat-grid-tile>
    </mat-grid-list>






    </div>
  `,
  styles: [`
.vinyl {
  position: absolute;
  background: #000;
  width: 1520px;
  height: 700px;
  top: 64px;
  left:0;
}
.vinyl img:not(.thumbnail){
  display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 25px;
    z-index: 1;
    animation: wave 8s infinite;
}
.vinyl .thumbnail{
  position: absolute;
  top: 206px;
  left: 568px;
  display: block;
  width: 384px;
  height: 288px;
  clip-path: circle(97px at center);
  z-index: 2;
  animation: rotate 8s linear infinite;
}

mat-slider.progressbar{
  width: 95%;
}
#player{
  width: 1520px;
  height: 700px;
}
.controls {
  position: relative;
  width: 1520px;
  height: 150px;
}
mat-grid-tile img{
  max-width: 90%;
}
.dark{
  color: rgb(54, 54, 54);
  cursor: default;
}
.active{
  color: #c2185b;
}
.active:hover{
  color: #f13c83;
}
i {
  color: #626262;
  font-size: 35px;
  margin-left: 10px;
  margin-right: 10px;
  cursor: pointer;
}
i.big {
  font-size: 55px;
}
i.small {
  font-size: 20px;
  margin-left: 5px;
  margin-right: 5px;
}
i.volume {
  font-size: 20px;
  margin: 0;
}
i:hover:not(.dark):not(.active){
  color: #fff;
}
span.spacer {
  display: block;
  width: 30px;
  height: 10px;
}
/deep/ .mat-slider-wrapper {
  height: 10px !important;
  top: 19px !important;
}
/deep/ .mat-slider-track-wrapper {
  height: 10px !important;
}
/deep/ .mat-slider-track-background {
  height: 10px !important;
}
/deep/ .mat-slider-track-fill {
  height: 10px !important;
  background-color: #c2185b !important;
}
/deep/ .mat-slider-thumb {
  background-color: #fff !important;
}
@keyframes wave {
  0% {
    transform: rotate(-50deg);
  }
  50% {
    transform: rotate(-20deg);
  }
  100% {
    transform: rotate(-50deg);
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
`]
})
export class IframeVideoComponent implements OnInit {

  playlist;

  constructor(private provider: ProviderService) { }

  YTplayer = (<any>window).YT || {};
  webPlayer;
  songId;
  songTitle;
  songThumbnail;
  songThumbnailH;

  playerSettings = {
    randomPlay: 0,
    repeatMode: 1,
    vinyl: 0
  };
  history: string[] = [];
  playerState = {
    inPlay: false,
    volume: 100
  };
  duration = {
    value: 1,
    current: 0,
    interval: undefined
  };

  ngOnInit() {
    this.provider.getSongsToPlay().subscribe((response) => {
      this.songId = response;
      console.log('odebrano w ifrmae', this.songId);
      this.onYouTubeIframeAPIReady(this.songId);
      this.history.push(this.songId);
      if(this.history.length>20){
        this.history.shift();
      }
      for(let i=0; i<this.playlist.tracks.length; i++){
        if(this.playlist.tracks[i].id === this.songId){
          this.songTitle = this.playlist.tracks[i].title;
          // console.log(this.playlist.tracks[i].thumbnails);
          this.songThumbnail = this.playlist.tracks[i].thumbnails.medium.url;
          this.songThumbnailH = this.playlist.tracks[i].thumbnails.high.url;
          console.log(this.playlist);
        }
      }
    });

    this.provider.getActivePlaylist().subscribe((response)=>{
      this.playlist = response;
    });
  }

  onYouTubeIframeAPIReady(id) {

    if (this.webPlayer) {
      this.changePlayState(false);
      this.webPlayer.stopVideo();
      this.webPlayer.destroy();
    }

    let pR = this.provider;
    let rS = this.playerSettings;
    let dR = this.duration;
    let vL = this.playerState;

    function onPlayerReady(event) {
      event.target.setVolume(vL.volume);
      dR.value = event.target.getDuration();
      if(dR.interval){
        clearInterval(dR.interval);
      }
      dR.interval = setInterval(function() {
        dR.current = event.target.getCurrentTime();
      }, 1000);

      event.target.playVideo();
      vL.inPlay = true;
    }

    function stateChange(event) {
      let state = event.target.getPlayerState();
      if (state === 0) {
        pR.playNext(rS.randomPlay, rS.repeatMode);
      }
      console.log('state change', event.target.getPlayerState(), event);

    }

    this.webPlayer = new this.YTplayer.Player('player', {
      height: '700',
      width: '1520',
      videoId: id,
      playerVars: {
        controls: 0
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': stateChange
      }
    });
  }

  playVideo() {
    this.webPlayer.playVideo();
    console.log('change state true');
    this.changePlayState(true);
  }

  pauseVideo() {
    this.webPlayer.pauseVideo();
    console.log('pause');
    this.changePlayState(false);
  }

  stopVideo() {
    this.webPlayer.stopVideo();
    this.changePlayState(false);
  }

  toggleRandom() {
    this.playerSettings.randomPlay = this.playerSettings.randomPlay === 0 ? 1 : 0;
  }

  toggleVinyl() {
    this.playerSettings.vinyl = this.playerSettings.vinyl === 0 ? 1 : 0;
  }

  toggleRepeat() {
    this.playerSettings.repeatMode = this.playerSettings.repeatMode === 0 ? 1 : this.playerSettings.repeatMode === 1 ? 2 : 0;
  }

  playNextSong() {
    console.log('play next', this.playerSettings.repeatMode);
    this.provider.playNext(this.playerSettings.randomPlay, this.playerSettings.repeatMode);
  }

  playPreviousSong() {
    if(this.history.length>1){
      this.history.pop();
      let songId = this.history.pop();
      this.provider.playSong(songId);
    }
  }

  changePlayState(inPlay: boolean) {
    console.log('change state', inPlay);
    this.playerState.inPlay = inPlay;
    console.log(this.playerState);
  }

  setVolume(volume:number){
    this.playerState.volume = volume;
    this.webPlayer.setVolume(volume);
  }
  rewindVideo(time:number){
    this.webPlayer.seekTo(time);
  }
}
