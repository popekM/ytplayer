import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaytracksComponent } from './displaytracks.component';

describe('DisplaytracksComponent', () => {
  let component: DisplaytracksComponent;
  let fixture: ComponentFixture<DisplaytracksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaytracksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaytracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
