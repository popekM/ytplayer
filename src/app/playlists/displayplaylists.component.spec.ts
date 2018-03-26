import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayplaylistsComponent } from './displayplaylists.component';

describe('DisplayplaylistsComponent', () => {
  let component: DisplayplaylistsComponent;
  let fixture: ComponentFixture<DisplayplaylistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayplaylistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayplaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
