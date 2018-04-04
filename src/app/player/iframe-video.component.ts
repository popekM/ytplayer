import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../provider.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-iframe-video',
  template: `

    <div id="player-container" [class.fullscreen]="playerSettings.fullscreen" (click)="playerSettings.fullscreen? toggleFullscreen():''">
      <div class="vinylt" *ngIf="!playerSettings.vinyl" [class.fullscreen]="playerSettings.fullscreen"></div>
      <div class="vinyl" *ngIf="playerSettings.vinyl">
        <img [style.animationPlayState]="playerState.inPlay ? 'running' : 'paused'" src="./assets/vinyl.png" alt="vinyl">
        <img [style.animationPlayState]="playerState.inPlay ? 'running' : 'paused'" class="thumbnail" [src]="songThumbnailH" alt="thumbnail">
      </div>

      <div id="player"></div>

    </div>
    <div class="controls" *ngIf="!playerSettings.fullscreen">

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
        <i class="material-icons small" (click)="toggleFullscreen()" [class.active]="playerSettings.fullscreen">fullscreen</i>
      </mat-grid-tile>

      <mat-grid-tile colspan="4" rowspan="1">
        <mat-slider class="progressbar" min="0" max="{{duration.value}}" step="1" [(ngModel)]="duration.current" (click)="rewindVideo(duration.current)"></mat-slider>
      </mat-grid-tile>
    </mat-grid-list>






    </div>
  `,
  styles: [`

.vinyl {
  background-image: url('../assets/discbg.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100%;
  background-color: #000;
  width: 100%;
  height: 100%;
}

.vinylt {
  position: absolute;
  background: rgba(13, 61, 61, 0.5);
  width: 1520px;
  height: 700px;
  top: 64px;
}
.vinyl img{
    position: relative;
    display: block;
    margin-left: auto;
    margin-right: auto;
    top: 25px;
    z-index: 1;
    animation: wave 12s infinite;
}
.fullscreen .vinyl img{
  top: 125px;
}
.vinyl .thumbnail{
  top: -444px;
  width: 384px;
  height: 288px;
  clip-path: circle(97px at center);
  z-index: 2;
  animation: rotate 8s linear infinite;
}
.fullscreen .vinyl .thumbnail{
  top: -344px;
}
#player-container {
  width: 1520px;
  height: 700px;
  overflow:hidden;
}
.fullscreen {
  position: absolute;
  width: 100% !important;
  height: 100% !important;
  top: 0;
  left: 0;
  z-index: 4;
}
mat-slider.progressbar{
  width: 95%;
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
    filter:hue-rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
    filter:hue-rotate(0deg);
  }
}

`]
})
export class IframeVideoComponent implements OnInit {

  playlist;

  constructor(private provider: ProviderService, public snackBar: MatSnackBar) {}

  YTplayer = (<any>window).YT || {};
  webPlayer;
  songId;
  songTitle;
  songThumbnail;
  songThumbnailH;

  playerSettings = {
    randomPlay: 0,
    repeatMode: 1,
    vinyl: 0,
    playlistMode: true,
    fullscreen: 0
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
    console.log('init', this.webPlayer);
    this.provider.getSongsToPlay().subscribe((response) => {
      if(typeof response === 'string'){
        this.songId = response;
        this.history.push(this.songId);
        if(this.history.length>20){
          this.history.shift();
        }
        for(let i=0; i<this.playlist.tracks.length; i++){
          if(this.playlist.tracks[i].id === this.songId){
            this.songTitle = this.playlist.tracks[i].title;
            this.songThumbnail = this.playlist.tracks[i].thumbnails.medium.url;
            this.songThumbnailH = this.playlist.tracks[i].thumbnails.high.url;
          }
        }
        this.playerSettings.playlistMode = true;
      }else{
        let res: any = response;
        this.songId = res.id;
        this.songTitle = res.title;
        this.songThumbnail = res.thumbnails.medium.url;
        this.songThumbnailH = res.thumbnails.high.url;
        this.playerSettings.playlistMode = false;
      }
      this.onYouTubeIframeAPIReady(this.songId);
    });

    this.provider.getActivePlaylist().subscribe((response)=>{
      this.playlist = response;
    });




  }
  ngOnDestroy(){
  }

  onYouTubeIframeAPIReady(id) {

    if (this.webPlayer) {
      this.changePlayState(false);
      this.webPlayer.pauseVideo();
      this.webPlayer.destroy();
    }

    let pR = this.provider;
    let rS = this.playerSettings;
    let dR = this.duration;
    let vL = this.playerState;
    let checkPlay: any = -1;

    this.webPlayer = new this.YTplayer.Player('player', {
      height: '700',
      width: '1520',
      videoId: id,
      playerVars: {
        controls: 0,
        disablekb: 1,
        iv_load_policy: 3,
        modestbranding: 1,
        showinfo: 0,
        rel: 0
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': stateChange
      }
    });

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
      console.log('state: ', state);
      if (state === 0) {
        if(rS.playlistMode){
          pR.playNext(rS.randomPlay, rS.repeatMode);
        }
      } else if (state === -1){
        let temp = 0;
        checkPlay = setTimeout(function() {
          if((event.target.getPlayerState() == -1 || event.target.getPlayerState() == 3) && temp == 0){
            console.log('pause start');
            event.target.pauseVideo();
            event.target.playVideo();
            temp = 1;
          }
        }, 2000);
      }
    }
  }

  playVideo() {
    this.webPlayer.playVideo();
    this.changePlayState(true);
  }

  pauseVideo() {
    this.webPlayer.pauseVideo();
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

  toggleFullscreen() {
    this.playerSettings.fullscreen = this.playerSettings.fullscreen === 0 ? 1 : 0;
    let temp = this.playerSettings;
    let player = this.webPlayer;
    if(this.playerSettings.fullscreen){

        let sb = this.snackBar;
        sb.open('To exit fullscreen mode press \'ESC\'', 'OK', {
          duration: 2500
        });
        setTimeout(function() {
          sb.open('To toggle browser fullscreen mode press \'F11\'', 'OK', {
            duration: 2500
          });
        }, 3000);


      document.addEventListener('keydown', function temp2(e) {
        let evt:any = e || window.event;
        let isEscape = false;
        if ("key" in evt) {
          isEscape = (evt.key == "Escape" || evt.key == "Esc");
        } else {
          isEscape = (evt.keyCode == 27);
        }
        if (isEscape) {
          document.removeEventListener('keydown', temp2);
          temp.fullscreen = 0;
          player.setSize(1520, 700);
        }
      });
      if(this.playerSettings.vinyl){
         this.webPlayer.setSize(1, 0);
      }else{
        this.webPlayer.setSize(window.innerWidth, window.innerHeight);
      }
    }else{
         this.webPlayer.setSize(1520, 700);
    }
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
    this.playerState.inPlay = inPlay;
  }

  setVolume(volume:number){
    this.playerState.volume = volume;
    this.webPlayer.setVolume(volume);
  }
  rewindVideo(time:number){
    this.webPlayer.seekTo(time);
  }
}
