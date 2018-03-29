import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeVideoComponent } from './iframe-video.component';

describe('IframeVideoComponent', () => {
  let component: IframeVideoComponent;
  let fixture: ComponentFixture<IframeVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IframeVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IframeVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
