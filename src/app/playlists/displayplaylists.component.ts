import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../provider.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

interface Playlist {
  name: string,
  color: string,
  tracks: any
};

@Component({
  selector: 'app-displayplaylists',
  template: `

  <h2>Playlists:<ng-content></ng-content></h2>

    <mat-nav-list>
      <a mat-list-item
        *ngFor="let i of playlists"
        [class.active]="i == activePlaylist"
        [style.borderColor]="i.color"
        (click)="changePlaylist(i)">
          {{ i.name }}
          <span>&nbsp;( {{ i.tracks.length }} )</span>
              <span class="spacer"></span>
              <i class="material-icons" (click)="deletePlaylist(i)">delete</i>
      </a>

    </mat-nav-list>
  `,
  styles: [`
    :host(){
      margin-left: 20px;
    }
    h2 {
      margin: 0;
      padding: 20px;
      background: #b10d4e;
    }
    a {
      border-left: 5px solid red;
    }
    span, i {
      color: #787878;
    }
    i:hover{
      color: #fff;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .active {
      background: rgba(255, 255, 255, 0.1);
    }
    mat-nav-list{
      padding: 20px;
    }
  `]
})
export class DisplayplaylistsComponent implements OnInit {

  playlists: Playlist[] = [];
  activePlaylist: any;
  dialogW: MatDialogRef<ConfirmationDialogComponent>;

  constructor(private provider: ProviderService, private dialog: MatDialog) { }

  ngOnInit() {
    this.playlists = this.provider.getPlaylists();
    this.provider.getActivePlaylist().subscribe((response)=>{
      this.activePlaylist = response;
    });
  }

  changePlaylist(pl) {
    this.provider.changeActivePlaylist(pl);
  }

  deletePlaylist(i){
    let pR = this.provider;
    this.dialogW = this.dialog.open(ConfirmationDialogComponent);
    this.dialogW.afterClosed().subscribe(result => {
      if(result){
        pR.deletePlaylist(i);
      }
    });
  }
}
