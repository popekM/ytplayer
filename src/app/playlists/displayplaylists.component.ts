import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../provider.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
@Component({
  selector: 'app-displayplaylists',
  template: `
    <h2>
      Playlists:
    </h2>

    <mat-nav-list>
      <a mat-list-item
        *ngFor="let i of playlists"
        [class.active]="i == activePlaylist"
        [style.borderColor]="i.color"
        (click)="changePlaylist(i)">
          {{ i.name }}
          <span>&nbsp;( {{ i.tracks.length }} )</span><i class="material-icons" (click)="deletePlaylist(i)">delete</i>
      </a>

    </mat-nav-list>
  `,
  styles: [`
    :host() {
      display: block;
      margin: 15px;
      padding: 15px;
      border: 1px solid rgb(156, 179, 14);
    }
    a {
      border-left: 5px solid red;
    }
    span {
      color: rgba(255, 255, 255, 0.3)
    }
    .active {
      background: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class DisplayplaylistsComponent implements OnInit {

  playlists: any[];
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
