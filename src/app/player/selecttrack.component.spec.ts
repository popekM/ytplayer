import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecttrackComponent } from './selecttrack.component';

describe('SelecttrackComponent', () => {
  let component: SelecttrackComponent;
  let fixture: ComponentFixture<SelecttrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelecttrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecttrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
