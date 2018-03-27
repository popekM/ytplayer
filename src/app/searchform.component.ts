import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProviderService } from './provider.service';
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/debounceTime";
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-searchform',
  template: `
  <form [formGroup]="searchForm">
     <input formControlName="query" type="text" class="form-control" placeholder="Search songs..." (focus)="searchMode()">
 </form>
 <div *ngIf="songsBuffer.length>0">
   <mat-card class="card" *ngFor="let i of songsBuffer.items">
   <mat-card-header>

     <mat-card-title>{{ i.title }}</mat-card-title>

   </mat-card-header>
   <img mat-card-image src="{{ i.thumbnails.medium.url }}" alt="Photo of a Shiba Inu">

   <mat-card-actions>
     <button mat-button>Play</button>
     <button mat-button>Add to Playlist</button>
   </mat-card-actions>
  </mat-card>
 </div>
  `,
  styles: [`
    .card {
      max-width: 200px;
      float: left;
      margin: 5px;
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
  display: boolean = false;

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
  }
}
