import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProviderService } from './provider.service';
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/debounceTime";
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-searchform',
  template: `
  <div class="overlay" *ngIf="overlay">
    <i (click)="exitSearchMode()" class="material-icons">clear</i>
  </div>

  <form [formGroup]="searchForm">
    <mat-form-field class="form-field">

      <input matInput formControlName="query" type="text" class="form-control" #forClear placeholder="Search for songs..." (focus)="searchMode()" (blur)="searchModeBlur()">

      <button mat-button *ngIf="forClear.value!='' && songsBuffer.prev!=''" matSuffix (click)="searchPrev()" mat-icon-button>
        <i class="material-icons">keyboard_arrow_left</i>
      </button>

      <button mat-button *ngIf="forClear.value!='' && songsBuffer.next!=''" (click)="searchNext()" matSuffix mat-icon-button>
        <i class="material-icons">keyboard_arrow_right</i>
      </button>

      <button mat-button *ngIf="forClear.value!=''" matSuffix mat-icon-button aria-label="Clear" (click)="forClear.value=''; clearInput()">
        <i class="material-icons">clear</i>
      </button>

  </mat-form-field>

 </form>
 <div class="card-overlay" *ngIf="overlay">
   <mat-card class="pl-card" *ngFor="let i of songsBuffer.items">
   <mat-card-header>
     <mat-card-title>{{ i.title }}</mat-card-title>
   </mat-card-header>

   <img mat-card-image src="{{ i.thumbnails.medium.url }}" alt="Music video photo">

   <mat-card-actions>
     <button mat-button (click)="playSong(i)"><i class="material-icons">play_arrow</i></button>
     <button mat-button class="right" [matMenuTriggerFor]="menu"><i class="material-icons">playlist_add</i></button>
     <mat-menu #menu="matMenu" [class]="hid">
       <button *ngFor="let b of playlists" mat-menu-item (click)="addSong(i, b)" [style.borderColor]="b.color">{{ b.name }}</button>
     </mat-menu>

   </mat-card-actions>
  </mat-card>
 </div>
  `,
  styles: [`
    .pl-card {
      max-width: 200px;
      float: left;
      margin: 5px;
      white-space: normal;
    }
    .mat-card {
      border: 1px solid #000;
    }
    .mat-card:hover {
      background: #c2185b;
      border: 1px solid #c2185b;
    }
    .mat-card-header{
      height: 60px;
      line-height: 20px;
      overflow: hidden;
    }
    .mat-card i {
      font-size: 40px;
    }
    .right {
      float: right;
    }
    form {
      height: 64px;
      min-width: 350px;
      max-width: 500px;
      width: 100%;
      z-index: 2;
    }
    .form-field {
      width: 100%;
      z-index: 5;
    }
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 4;
    }
    .overlay i {
      position: absolute;
      display: block;
      top: 20px;
      right: 40px;
      font-size: 60px;
    }
    .overlay i + i {
      top: 60px;
      right: initial;
      left: 60%;
    }
    .overlay i:first-child + i {
      left: 40%;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .card-overlay {
      position: absolute;
      top: 100px;
      left: 0;
      width: 100%;
      z-index: 4;
    }
    .mat-menu-item{
      border-left: 5px solid;
    }

@media only screen and (max-width: 900px) {
    form {
      min-width: 100px;
      max-width: 200px;
      overflow: hidden;
    }
    .overlay i {
      top: 10px;
      right: 20px;
      font-size: 40px;
    }
  }
@media only screen and (max-width: 500px) {
    .overlay i {
      top: 10px;
      right: 20px;
      font-size: 30px;
    }
    .mat-card {
      max-width: 110px;
    }
    .mat-button {
      padding: 0;
    }
    .card-overlay {
      top: initial;
    }
    .mat-card{
      padding: 10px 16px;
    }
    .mat-card-image{
      margin: 6px -16px;
    }
    .mat-card-actions{
      padding: 0;
    }
    .mat-card-header {
      height: 40px;
    }
}
  `]
})
export class SearchformComponent implements OnInit {

  @Output('play')
  emitter = new EventEmitter();

  searchForm: FormGroup;
  songsBuffer: any = {
    length: 0,
    items: [],
    prev: '',
    next: ''
  };
  initalized: boolean = false;
  overlay: boolean = false;
  playlists: any[];

  constructor(private provider: ProviderService, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.playlists = this.provider.getPlaylists();
    this.searchForm = new FormGroup({
      'query': new FormControl('')
    });

    this.searchForm.get('query').valueChanges
      .distinctUntilChanged()
      .debounceTime(500)
      .subscribe(value => {
        if (value.length > 2) {
          this.provider.execQ(value, 14, '');
        } else {
          this.songsBuffer = {
            length: 0,
            items: [],
            prev: '',
            next: ''
          };
        }
      });
  }

  searchNext() {
    this.provider.execQ(this.searchForm.get('query').value, 14, this.songsBuffer.next);
  }

  searchPrev() {
    this.provider.execQ(this.searchForm.get('query').value, 14, this.songsBuffer.prev);
  }

  searchMode() {
    if (!this.initalized) {
      this.provider.initApi();
      this.provider.getSongs().subscribe((response: any) => {
        this.songsBuffer = response;
        this.ref.detectChanges();
      });
      this.initalized = true;
    }
    this.overlay = true;
  }

  exitSearchMode() {
    this.overlay = false;
  }

  searchModeBlur() {
    if (this.songsBuffer.length === 0) {
      this.exitSearchMode();
    }
  }

  clearInput() {
    this.songsBuffer = {
      length: 0,
      items: []
    };
  }

  addSong(song, playlist) {
    this.provider.addSong(song, playlist);
    document.getElementsByClassName('mat-menu-panel')[0].innerHTML = '';
  }

  playSong(id) {
    this.provider.playSong(id);
    this.exitSearchMode();
    this.ref.detectChanges();
    this.emitter.emit();
  }

}
