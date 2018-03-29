import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../provider.service';

@Component({
  selector: 'app-iframe-video',
  template: `
    <div id="player"></div>
    <p (click)="playVideo()">play</p>
    <p (click)="pauseVideo()">pause</p>
    <p (click)="toggleRandom()">toggleRandom: {{ repeatSettings.randomPlay }}</p>
    <p (click)="toggleRepeat()">toggleRepeat: {{ repeatSettings.repeatMode }}</p>
    <p (click)="playNextSong()">next</p>
    <p (click)="playPreviousSong()" *ngIf="history.length>1">previous</p>
    <br>
    <p (click)="setVolume(0); volume=0">mute</p>dr {{ duration.value }}
    <mat-slider thumbLabel min="0" max="100" step="1" [(ngModel)]="volume" (click)="setVolume(volume)"></mat-slider>
    <br>
    progressbar<br>
        <mat-slider class="progressbar" min="0" max="{{duration.value}}" step="1" [(ngModel)]="duration.current" (click)="rewindVideo(duration.current)"></mat-slider>
      <br><br><br><br>
  `,
  styles: [`
    mat-slider {
      margin-left: 100px;
  width: 300px;
}
mat-slider.progressbar{
  width: 500px;
}
`]
})
export class IframeVideoComponent implements OnInit {

  constructor(private provider: ProviderService) { }

  YTplayer = (<any>window).YT || {};
  webPlayer;
  songId;
  repeatSettings = {
    randomPlay: 0,
    repeatMode: 1
  };
  history: string[] = [];
  volume = "100";
  duration = {
    value: 0,
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
    });
  }

  onYouTubeIframeAPIReady(id) {

    if (this.webPlayer) {
      this.webPlayer.stopVideo();
      this.webPlayer.destroy();
    }

    let pR = this.provider;
    let rS = this.repeatSettings;
    let dR = this.duration;

    function onPlayerReady(event) {
      dR.value = event.target.getDuration();
      if(dR.interval){
        clearInterval(dR.interval);
      }
      dR.interval = setInterval(function() {
        dR.current = event.target.getCurrentTime();
      }, 1000);

      event.target.playVideo();
    }

    function stateChange(event) {
      let state = event.target.getPlayerState();
      if (state === 0) {
        pR.playNext(rS.randomPlay, rS.repeatMode);
      }
      console.log('state change', event.target.getPlayerState(), event);

    }

    this.webPlayer = new this.YTplayer.Player('player', {
      height: '360',
      width: '640',
      videoId: id,
      playerVars: {
        controls: 1
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': stateChange
      }
    });
  }

  playVideo() {
    this.webPlayer.playVideo();
  }

  pauseVideo() {
    this.webPlayer.pauseVideo();
  }

  stopVideo() {
    this.webPlayer.stopVideo();
  }

  toggleRandom() {
    console.log('tr');
    this.repeatSettings.randomPlay = this.repeatSettings.randomPlay === 0 ? 1 : 0;
  }

  toggleRepeat() {
    this.repeatSettings.repeatMode = this.repeatSettings.repeatMode === 0 ? 1 : this.repeatSettings.repeatMode === 1 ? 2 : 0;
  }

  playNextSong() {
    this.provider.playNext(this.repeatSettings.randomPlay, this.repeatSettings.repeatMode);
  }

  playPreviousSong() {
    if(this.history.length>1){
      this.history.pop();
      let songId = this.history.pop();
      this.provider.playSong(songId);
    }
  }

  setVolume(volume:number){
    this.webPlayer.setVolume(volume);
  }
  rewindVideo(time:number){
    this.webPlayer.seekTo(time);
  }
}
