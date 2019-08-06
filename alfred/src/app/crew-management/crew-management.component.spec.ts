import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrewManagementComponent } from './crew-management.component';

describe('CrewManagementComponent', () => {
  let component: CrewManagementComponent;
  let fixture: ComponentFixture<CrewManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrewManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrewManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
