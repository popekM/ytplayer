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
  }

  //adds song to active playlist
  addSong(song, playlist) {
    let index = this.data.indexOf(playlist);
    this.data[index].tracks.push(song);
  }

  getSongsToPlay() {
      return Observable.from(this.activeSong);
  }

  playSong(id){
    this.activeSong.next(id);
  }
}
