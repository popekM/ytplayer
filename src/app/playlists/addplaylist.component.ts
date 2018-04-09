import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../provider.service';

@Component({
  selector: 'app-addplaylist',
  templateUrl: './addplaylist.component.html',
  styleUrls: ['./addplaylist.component.scss']
})
export class AddplaylistComponent implements OnInit {

  createPlaylistForm: boolean = false;
  nameValue: string = '';
  colorValue: string = '#7ce8ff';

  constructor(private provider: ProviderService) { }

  ngOnInit() {
  }

  addPlaylist() {
    let newPlaylist = {
      name: '',
      color: '',
      tracks: []
    };
    newPlaylist.name = this.nameValue;
    newPlaylist.color = this.colorValue;
    this.provider.addPlaylist(newPlaylist);
    this.nameValue = '';
    this.colorValue = '#7ce8ff';
    this.createPlaylistForm = false;
  }

  abandon() {
    this.nameValue = '';
    this.colorValue = '#7ce8ff';
    this.createPlaylistForm = false;
  }
}
