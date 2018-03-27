import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ProviderService {

  ytapi = (<any>window).gapi || {};

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

  constructor() { }

  // initialize youtube api
  initApi() {
    this.ytapi.client.setApiKey("AIzaSyC_d4F0MGqp1JxMvSnPCte-YPJ2_V7-A6k");
    this.ytapi.client.load("youtube", "v3", function() {
      // api is ready
    });
    console.log('API init done');
  };

  // query execution
  execQ() {
    let result;
    let request = this.ytapi.client.youtube.search.list({
      q: 'linkin park',
      part: 'snippet',
      maxResults: 10,
      type: "video"
    });
    request.execute(function(response) {
      console.log(response);
      // console.log(response.result.items);
      console.log('exec done');
      result = response;
    });
    return result;
  };

  // return all playlists data
  getPlaylists() {
    return this.data;
  }

  // return currently active playlist ( stream)
  getActivePlaylist = function() {
    return Observable.from(this.activePlaylist).startWith(this.data[0]);
  }

  // change active playlist
  changeActivePlaylist(pl) {
    this.activePlaylist.next(pl);
  }

}
