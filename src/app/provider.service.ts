import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ProviderService {

  ytapi = (<any>window).gapi || {};

  // information if YouTube api was initialized
  apiInitialized: boolean = false;

  data: any[] = [
    {
      name: 'test',
      color: '#ab1111',
      tracks: [
        {
          title: 'title1',
          duration: 23,
          id: '$dfvb'
        },
        {
          title: 'title7',
          duration: 34,
          id: '$drefgb'
        }
      ]
    },
    {
      name: 'test2',
      color: '#a8da1b',
      tracks: []
    },
    {
      name: 'test3',
      color: '#1c8dbe',
      tracks: []
    }
  ];

  // stream of currently active playlist
  activePlaylist: any = new Subject();
  // currently active playlist
  activePlaylistState: any = this.data[0];

  // stream of currently searched songs
  songsList: any = new Subject();

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
      maxResults: 10,
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
}
