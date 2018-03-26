import { Injectable } from '@angular/core';

@Injectable()
export class ProviderService {

  ytapi = (<any>window).gapi || {};

  constructor() { }

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

}
