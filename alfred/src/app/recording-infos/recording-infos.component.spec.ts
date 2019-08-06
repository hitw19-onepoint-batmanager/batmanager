import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingInfosComponent } from './recording-infos.component';

describe('RecordingInfosComponent', () => {
  let component: RecordingInfosComponent;
  let fixture: ComponentFixture<RecordingInfosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordingInfosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
