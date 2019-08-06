/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { ObservationComponent } from "./observation.component";

describe("ObservationComponent", () => {
  let component: ObservationComponent;
  let fixture: ComponentFixture<ObservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ObservationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
