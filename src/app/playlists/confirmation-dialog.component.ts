import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
  <h1 mat-dialog-title>Delete playlist:</h1>
    <mat-dialog-content>
      Are you sure to delete this playlist?
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true">Yes</button>
      <button mat-button mat-dialog-close>No</button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class ConfirmationDialogComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
