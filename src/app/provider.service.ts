import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ProviderService {

  ytapi = (<any>window).gapi || {};

  // information if YouTube api was initialized
  apiInitialized: boolean = false;

  data: any[] = [
    {
      name:"Default",
      color:"#1194ab",
      tracks:[
        {
          id:"eMqsWc8muj8",
          title:"Muse - Bliss",
          duration:0,
          thumbnails:{
            default:{
              url:"https://i.ytimg.com/vi/eMqsWc8muj8/default.jpg",
              width:120,
              height:90
            },
            high:{
              url:"https://i.ytimg.com/vi/eMqsWc8muj8/hqdefault.jpg",
              width:480,
              height:360
            },
            medium:{
              url:"https://i.ytimg.com/vi/eMqsWc8muj8/mqdefault.jpg",
              width:320,
              height:180
            }
          }
        },
        {
          id:"Om_VWBua0_M",
          title:"Foxy Shazam - \"Oh Lord\" [Official Music Video]",
          duration:0,
          thumbnails:{
            default:{
              url:"https://i.ytimg.com/vi/Om_VWBua0_M/default.jpg",
              width:120,
              height:90
            },
            high:{
              url:"https://i.ytimg.com/vi/Om_VWBua0_M/hqdefault.jpg",
              width:480,
              height:360
            },
            medium:{
              url:"https://i.ytimg.com/vi/Om_VWBua0_M/mqdefault.jpg",
              width:320,
              height:180
            }
          }
        },
        {
          id:"RYnFIRc0k6E",
          title:"Limp Bizkit - Rollin' (Air Raid Vehicle)",
          duration:0,
          thumbnails:{
            default:{
              url:"https://i.ytimg.com/vi/RYnFIRc0k6E/default.jpg",
              width:120,
              height:90
            },
            high:{
              url:"https://i.ytimg.com/vi/RYnFIRc0k6E/hqdefault.jpg",
              width:480,
              height:360
            },
            medium:{
              url:"https://i.ytimg.com/vi/RYnFIRc0k6E/mqdefault.jpg",
              width:320,
              height:180
            }
          }
        }
      ]
    },
    {
      name:"asd",
      color:"#11ab3c",
      tracks:[]
    },
    {
      name:"sdf",
      color:"#ff0000",
      tracks:[]
    },
    {
      name:"dfg",
      color:"#bbff2b",
      tracks:[]
    }
  ];

  // stream of currently active playlist
  activePlaylist: any = new Subject();
  // currently active playlist
  activePlaylistState: any = this.data[0];

  // stream of currently searched songs
  songsList: any = new Subject();

  // currently selected songs
  activeSong: any = new Subject();

  // currentyl played songId
  songId: string = '';

  constructor() { }

  // initialize youtube api
  initApi() {
    if (!this.apiInitialized) {
      this.ytapi.client.setApiKey("AIzaSyC_d4F0MGqp1JxMvSnPCte-YPJ2_V7-A6k");
      this.ytapi.client.load("youtube", "v3", function() {
        // api is ready
      });
      this.apiInitialized = true;
    }
  };

  // query execution
  execQ(q) {
    let temp = this.songsList;
    let request = this.ytapi.client.youtube.search.list({
      q: q,
      part: 'snippet',
      maxResults: 14,
      type: "video"
    });

    request.execute(function(response: any) {
      let tempSongs: any = {
        length: response.items.length,
        items: []
      };
      for (let i = 0; i < response.items.length; i++) {
        let song = {
          id: response.items[i].id.videoId,
          title: response.items[i].snippet.title,
          duration: 0,
          thumbnails: {
            default: {
              url: response.items[i].snippet.thumbnails.default.url,
              width: response.items[i].snippet.thumbnails.default.width,
              height: response.items[i].snippet.thumbnails.default.height,
            },
            high: {
              url: response.items[i].snippet.thumbnails.high.url,
              width: response.items[i].snippet.thumbnails.high.width,
              height: response.items[i].snippet.thumbnails.high.height,
            },
            medium: {
              url: response.items[i].snippet.thumbnails.medium.url,
              width: response.items[i].snippet.thumbnails.medium.width,
              height: response.items[i].snippet.thumbnails.medium.height,
            }
          }
        };
        tempSongs.items.push(song);
      }
      temp.next(tempSongs);
    });
  };

  // return all playlists data
  getPlaylists() {
    return this.data;
  }

  // return currently active playlist ( stream)
  getActivePlaylist = function() {
    return Observable.from(this.activePlaylist).startWith(this.activePlaylistState);
  }

  // return currently searched songs ( stream)
  getSongs = function() {
    return Observable.from(this.songsList);
  }

  // change active playlist
  changeActivePlaylist(pl) {
    this.activePlaylistState = pl;
    this.activePlaylist.next(pl);
  }

  addPlaylist(pl) {
    this.data.push(pl);
    if(this.data.length==1){
      this.activePlaylistState = this.data[0];
      this.activePlaylist.next(this.activePlaylistState);
    }
  }

  //adds song to active playlist
  addSong(song, playlist) {
    let index = this.data.indexOf(playlist);
    this.data[index].tracks.push(song);
  }

  getSongsToPlay() {
      return Observable.from(this.activeSong);
  }

  // send ID of song to play to player
  playSong(id) {
    this.songId = id;
    this.activeSong.next(id);
  }

  // pick ID of song to play from currently active playlist
  // parameters:
  //            s - shuffle: 0 - next song, 1 - random pick
  //            r - repeat: 0 - dont - repeat playlis, 1 - repeat whole playlist, 2 - repeat 1 song
  playNext(s: number, r: number) {
    let temp: string = '';
    let length: number = this.activePlaylistState.tracks.length;
    let trackIndex: number = 0;

    if(r===2){
      // repeat 1 song
      this.playSong(this.songId);
    } else {
      if(s===1){
        // random pick
        trackIndex = Math.floor(Math.random()*length);
        this.songId = this.activePlaylistState.tracks[trackIndex].id;
        this.playSong(this.songId);
      }else{
        // play next in list
        for(let i=0; i<length; i++){
          if(this.activePlaylistState.tracks[i].id === this.songId){
            trackIndex = i;
            break;
          }
        }
        if((trackIndex+1)!==length){
          // not last song in list
          trackIndex++;
          this.songId = this.activePlaylistState.tracks[trackIndex].id;
          this.playSong(this.songId);
        }else{
          // last song in list
          if(r===0) {
            // don't repeat playlist
          }else{
            // play pla
            this.songId = this.activePlaylistState.tracks[0].id;
            this.playSong(this.songId);
          }
        }
      }
    }
  }

  deletePlaylist(i) {
    this.data.splice(this.data.indexOf(i),1);

    if(this.data.indexOf(this.activePlaylistState)===(-1)){
      if(this.data.length>0){
        this.activePlaylistState = this.data[0];
      }else{
        this.activePlaylistState = { name: 'No playlists', color: '#b10000', tracks: []};
      }
      this.activePlaylist.next(this.activePlaylistState);
    }
  }

  // i - song to change, a - action:
  //                      0 - move top
  //                      1 - move up
  //                      2 - move down
  //                      3 - move bottom
  //                      4 - delete
  manageTracks(i, a){
    let playlistIndex = this.data.indexOf(this.activePlaylistState);
    let songIndex = this.data[playlistIndex].tracks.indexOf(i);
    let length =  this.data[playlistIndex].tracks.length;
    this.data[playlistIndex].tracks.splice(songIndex, 1);
    if(a===0){
      this.data[playlistIndex].tracks.unshift(i);
    }else if(a===1){
      if(songIndex!=0){
        songIndex--;
      }
      this.data[playlistIndex].tracks.splice(songIndex, 0, i);
    }else if(a===2){
      if(++songIndex==length){
        songIndex--;
      }
      this.data[playlistIndex].tracks.splice(songIndex, 0, i);
    }else if(a===3){
      this.data[playlistIndex].tracks.push(i);
    }
    this.activePlaylist.next(this.data[playlistIndex]);
  }

}
