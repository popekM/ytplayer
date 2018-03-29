import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../provider.service';

@Component({
  selector: 'app-iframe-video',
  template: `
    <div id="player"></div>
    <p (click)="playVideo()">play</p>
    <p (click)="stopVideo()">stop</p>
  `,
  styles: []
})
export class IframeVideoComponent implements OnInit {

    constructor(private provider: ProviderService) { }

  YTplayer = (<any>window).YT || {};
  webPlayer;
  songId;

  ngOnInit() {
    this.provider.getSongsToPlay().subscribe((response)=>{
      this.songId = response;
      console.log('odebrano w ifrmae', this.songId);
      this.onYouTubeIframeAPIReady(this.songId);
    });
  }

  onYouTubeIframeAPIReady(id) {
    if(this.webPlayer){
      this.webPlayer.stopVideo();
      this.webPlayer.destroy();
    }
    this.webPlayer = new this.YTplayer.Player('player', {
      height: '360',
      width: '640',
      videoId: id,
      playerVars: {
        controls: 0
      },
      events: {
        'onReady': this.onPlayerReady
      }
    });
  }

  onPlayerReady(event) {
    event.target.playVideo();
  }

  onPlayerStateChange(event) {
    // if (event.data == temp.PlayerState.PLAYING && !done) {
    //   setTimeout(stopVideo, 6000);
    //   done = true;
    // }
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

}
