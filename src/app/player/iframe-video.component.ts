import { Component, OnInit, HostListener } from '@angular/core';
import { ProviderService } from '../provider.service';
import { MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-iframe-video',
  template: `

    <div id="player-container"
      [class.fullscreen]="playerSettings.fullscreen"
      (click)="playerSettings.fullscreen? toggleFullscreen():''"
      [style.width.px]="windowSize.elWidth"
      [style.height.px]="windowSize.height - windowSize.top - 150">
      <div class="vinylt"
        *ngIf="!playerSettings.vinyl"
        [class.fullscreen]="playerSettings.fullscreen"
        [style.width.px]="windowSize.elWidth"
        [style.height.px]="windowSize.height - windowSize.top - 150"
        [style.top.px]="windowSize.top">
      </div>
      <div class="info" *ngIf="playerSettings.info" [style.lineHeight.px]="windowSize.elHeight">
        Pick song first...
      </div>
      <div class="vinyl" *ngIf="playerSettings.vinyl">
        <img [style.animationPlayState]="playerState.inPlay ? 'running' : 'paused'" src="./assets/vinyl.png"
          [style.top.px]="windowSize.vinylTop"
          [style.width.px]="windowSize.vinylWH"
          [style.height.px]="windowSize.vinylWH"
          alt="vinyl">
        <img [style.animationPlayState]="playerState.inPlay ? 'running' : 'paused'"
          class="thumbnail"
          [src]="songThumbnailH"
          [style.width.px]="windowSize.thumbWidth"
          [style.height.px]="windowSize.thumbHeight"
          [style.top.px]="windowSize.thumbTop"
          [style.left.px]="windowSize.thumbLeft"
          [style.clipPath]="windowSize.thumbClip"
          alt="thumbnail">
      </div>

      <div id="player"></div>

    </div>
    <div class="controls"
      *ngIf="!playerSettings.fullscreen"
      [style.width.px]="windowSize.elWidth">

    <mat-grid-list [cols]="windowSize.cols" [rowHeight]="windowSize.colsH">

      <mat-grid-tile colspan="1" rowspan="2" *ngIf="windowSize.width>1100 || (windowSize.width<=700 && windowSize.width>530)">
        <img [src]="songThumbnail" alt="thumbnail">
      </mat-grid-tile>

      <mat-grid-tile
        [class.left]="windowSize.width<=530"
        [colspan]="windowSize.width>530?1:6"
        [rowspan]="windowSize.width>530?2:1"
        *ngIf="windowSize.width>840 || windowSize.width<=700">

          {{songTitle}}
      </mat-grid-tile>

      <mat-grid-tile class="controlsW" colspan="2" rowspan="1" *ngIf="windowSize.width<=530">
      <button mat-icon-button color="primary" (click)="toggleSettings()">
        <i class="material-icons settings" [class.active]="windowSize.dispSettings">settings</i>
      </button>
      </mat-grid-tile>

      <mat-grid-tile [colspan]="windowSize.colsC" [rowspan]="windowSize.width>530?1:2">
        <i class="material-icons" (click)="playPreviousSong()" [class.dark]="history.length==0">skip_previous</i>
        <i class="material-icons big" (click)="playVideo()" *ngIf="!playerState.inPlay">play_arrow</i>
        <i class="material-icons big" (click)="pauseVideo()" *ngIf="playerState.inPlay">pause</i>
        <i class="material-icons" (click)="playNextSong()">skip_next</i>
      </mat-grid-tile>

      <mat-grid-tile class="controlsW" [colspan]="windowSize.width>530?2:8" rowspan="2" *ngIf="windowSize.width>1550 || (windowSize.width<=530 && windowSize.dispSettings)">

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

      <mat-grid-tile class="controlsW" colspan="2" rowspan="1" *ngIf="windowSize.width<=1550 && windowSize.width>530">

          <i class="material-icons small" (click)="toggleRandom()" [class.active]="playerSettings.randomPlay">shuffle</i>
          <i class="material-icons small" (click)="toggleRepeat()" *ngIf="playerSettings.repeatMode!==2" [class.active]="playerSettings.repeatMode">repeat</i>
          <i class="material-icons small" (click)="toggleRepeat()" *ngIf="playerSettings.repeatMode===2" [class.active]="playerSettings.repeatMode">repeat_one</i>
          <i class="material-icons small" (click)="toggleVinyl()" [class.active]="playerSettings.vinyl">album</i>
          <i class="material-icons small" (click)="toggleFullscreen()" [class.active]="playerSettings.fullscreen">fullscreen</i>

      </mat-grid-tile>



      <mat-grid-tile *ngIf="!windowSize.dispSettings" [colspan]="windowSize.colsC" [rowspan]="windowSize.width>530?1:2">
        <mat-slider class="progressbar" min="0" max="{{duration.value}}" step="1" [(ngModel)]="duration.current" (click)="rewindVideo(duration.current)"></mat-slider>
      </mat-grid-tile>


      <mat-grid-tile class="controlsW" colspan="2" rowspan="1" *ngIf="windowSize.width<=1550 && windowSize.width>530">

          <i class="material-icons small active volume" *ngIf="playerState.volume===0" (click)="setVolume(10)">volume_off</i>
          <i class="material-icons small volume" *ngIf="playerState.volume!==0" (click)="setVolume(0)">volume_mute</i>
          <mat-slider thumbLabel min="0" max="100" step="1" [(ngModel)]="playerState.volume" (click)="setVolume(playerState.volume)"></mat-slider>
          <i class="material-icons small volume" (click)="setVolume(100)" [class.active]="playerState.volume===100">volume_up</i>

      </mat-grid-tile>



    </mat-grid-list>






    </div>
  `,
  styles: [`

.vinyl {
  background-image: url('../assets/discbg.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-color: #000;
  width: 100%;
  height: 100%;
}
.info{
  text-align: center;
  font-size: 40px;
}
.vinylt {
  position: absolute;
}
.vinyl img{
    position: relative;
    display: block;
    margin-left: auto;
    margin-right: auto;
    z-index: 1;
    animation: wave 12s infinite;
}
.vinyl .thumbnail{
  position: absolute;
  z-index: 2;
  animation: rotate 8s linear infinite;
}
#player-container {
  overflow:hidden;
}
.fullscreen {
  position: absolute;
  width: 100% !important;
  height: 100% !important;
  top: 0;
  left: 0;
  z-index: 5;
}
mat-slider.progressbar{
  width: 95%;
}
.controls {
  position: relative;
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
.settings {
  font-size: 20px;
}
/deep/ .left .mat-figure {
  white-space: nowrap;
  justify-content: left !important;
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
  @HostListener('window:resize')
  onResize() {
    this.setDimensions();
  }

  playlist;

  constructor(private provider: ProviderService, public snackBar: MatSnackBar, private sanitizer: DomSanitizer) {}

  YTplayer = (<any>window).YT || {};
  webPlayer;
  songId;
  songTitle;
  songThumbnail;
  songThumbnailH;
  windowSize = {
    width: 0,
    height: 0,
    top: 0,
    cols: 0,
    colsC: 0,
    elWidth: 0,
    elHeight: 0,
    colsH: '',
    dispSettings: false,
    vinylTop: 0,
    vinylWH: 0,
    thumbWidth: 0,
    thumbHeight: 0,
    thumbClip: null,
    thumbTop: 0,
    thumbLeft: 0
  };
  playerSettings = {
    randomPlay: 0,
    repeatMode: 1,
    vinyl: 0,
    playlistMode: true,
    fullscreen: 0,
    info: false
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
    this.setDimensions();
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
        this.playerSettings.info = false;
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
    let wS = this.windowSize;
    let checkPlay: any = '';

    this.webPlayer = new this.YTplayer.Player('player', {
      height: wS.height - wS.top - 150,
      width: wS.elWidth,
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
    if(this.webPlayer){
      this.webPlayer.playVideo();
      this.changePlayState(true);
    }else{
      console.log('aaaa');
      this.playerSettings.info=true;
    }
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
    let size = this.windowSize;
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
          player.setSize(size.elWidth, size.elHeight);
        }
      });
      if(this.playerSettings.vinyl){
         this.webPlayer.setSize(1, 0);
      }else{
        this.webPlayer.setSize(document.body.clientWidth, window.innerHeight);
      }
    }else{
         this.webPlayer.setSize(size.elWidth, size.elHeight);
    }
    if(this.playerSettings.vinyl){
      this.calcVinyl();
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

  toggleSettings(){
    this.windowSize.dispSettings = !this.windowSize.dispSettings;
  }

  setDimensions() {
    this.windowSize.height = window.innerHeight;
    this.windowSize.width = document.body.clientWidth;
    this.windowSize.colsH = '74px';
    if(this.windowSize.width>700){
      this.windowSize.elWidth = this.windowSize.width-380;
    }else{
      this.windowSize.elWidth = this.windowSize.width;
    }
    if(this.windowSize.width>599){
      this.windowSize.top = 64;
    }else{
      this.windowSize.top = 56;
    }
    this.windowSize.elHeight = this.windowSize.height - this.windowSize.top - 150;
    this.calcVinyl();

    if(this.windowSize.width>1100){
      this.windowSize.cols = 8;
      this.windowSize.colsC = 4;
    } else if (this.windowSize.width>950){
      this.windowSize.cols = 7;
      this.windowSize.colsC = 4;
    }else if (this.windowSize.width>840){
      this.windowSize.cols = 6;
      this.windowSize.colsC = 3;
    } else if (this.windowSize.width>780){
      this.windowSize.cols = 5;
      this.windowSize.colsC = 3;
    } else if (this.windowSize.width>700){
      this.windowSize.cols = 4;
      this.windowSize.colsC = 2;
    }else if(this.windowSize.width>530){
      this.windowSize.cols = 8;
      this.windowSize.colsC = 4;
    }else{
      this.windowSize.colsH = '29px';
      this.windowSize.cols = 8;
      this.windowSize.colsC = 8;
    }
    if(this.webPlayer && !this.playerSettings.vinyl){
       this.webPlayer.setSize(this.windowSize.elWidth, this.windowSize.elHeight);
     }
  }
  calcVinyl(){
    let min;
    let mino;
    let elWidth = this.windowSize.elWidth;
    let elHeight = this.windowSize.height - this.windowSize.top - 150;
    let top =  this.windowSize.top;
    if(this.playerSettings.fullscreen){
      elWidth = window.innerWidth;
      elHeight = window.innerHeight;
      top = 0;
    }

    if(elWidth < elHeight){
      mino = elWidth;
      min = Math.floor(mino * 0.9 * 0.3);
      this.windowSize.vinylTop = Math.floor((elHeight-elWidth)/2 + mino*0.05);
    }else{
      mino = elHeight;
      min = Math.floor(mino * 0.9 * 0.3);
      this.windowSize.vinylTop = Math.floor(mino*0.05);
    }
    this.windowSize.vinylWH = Math.floor(mino * 0.9);
    this.windowSize.thumbWidth = Math.floor(min*4/3);
    this.windowSize.thumbHeight= min;
    this.windowSize.thumbClip = this.sanitizer.bypassSecurityTrustStyle('circle(' + Math.floor(min/2) + 'px at center)');
    this.windowSize.thumbTop = Math.floor(elHeight/2 + top - this.windowSize.thumbHeight/2);
    this.windowSize.thumbLeft = Math.floor(elWidth/2 - this.windowSize.thumbWidth/2);
  }
}
