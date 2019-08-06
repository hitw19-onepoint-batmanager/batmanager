/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from "@angular/core/testing";
import { ConnectivityService } from "./Connectivity.service";

describe("Service: Connectivity", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConnectivityService]
    });
  });

  it("should ...", inject([ConnectivityService], (service: ConnectivityService) => {
    expect(service).toBeTruthy();
  }));
});
