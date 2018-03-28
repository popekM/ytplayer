import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProviderService } from './provider.service';
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/debounceTime";
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-searchform',
  template: `
  <div class="overlay" *ngIf="overlay"><span (click)="exitSearchMode()">x</span></div>
  <form [formGroup]="searchForm">
    <mat-form-field class="form-field">
     <input matInput formControlName="query" type="text" class="form-control" placeholder="Search for songs..." (focus)="searchMode()" (blur)="searchModeBlur()">
    </mat-form-field>

 </form>
 <div class="card-overlay" *ngIf="overlay">
   <mat-card class="pl-card" *ngFor="let i of songsBuffer.items">
   <mat-card-header>

     <mat-card-title>{{ i.title }}</mat-card-title>

   </mat-card-header>
   <img mat-card-image src="{{ i.thumbnails.medium.url }}" alt="Music video photo">

   <mat-card-actions>
     <button mat-button>Play</button>
     <button mat-button>Add to Playlist</button>
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
      color: #000;
      background: #c2185b;
      border: 1px solid #c2185b;
    }
    .mat-card-header{
      height: 60px;
      line-height: 20px;
      overflow: hidden;
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
      z-index: 2;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 1;
    }

    .overlay span {
      position: absolute;
      display: block;
      top: 20px;
      right: 40px;
      font-size: 60px;
    }
        .card-overlay {
      position: absolute;
      top: 100px;
      left: 0;
      width: 100%;
      min-height: 200px;
      z-index: 2;
    }
  `]
})
export class SearchformComponent implements OnInit {

  searchForm: FormGroup;
  songsBuffer: any = {
    length: 0,
    items: []
  };
  initalized: boolean = false;
  overlay: boolean = false;


  constructor(private provider: ProviderService, private ref: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.searchForm = new FormGroup({
      'query': new FormControl('')
    });

    this.searchForm.get('query').valueChanges
      .distinctUntilChanged()
      .debounceTime(500)
      .subscribe(value => {
        if (value.length > 2) {
          this.provider.execQ(value);
          console.log('search execution, query: ', value);
        } else {
          this.songsBuffer = {
            length: 0,
            items: []
          };
        }
      });
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

    // display overlay
    this.overlay=true;
  }

  exitSearchMode() {
    this.overlay=false;
  }


  searchModeBlur() {
    if(this.searchForm.get('query').value.length < 2){
      this.exitSearchMode();
    }
  }
}
