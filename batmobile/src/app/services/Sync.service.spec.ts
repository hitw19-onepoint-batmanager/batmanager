/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from "@angular/core/testing";
import { SyncService } from "./Sync.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("Service: Sync", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SyncService],
      imports: [HttpClientTestingModule ]
    });
  });

  it("should ...", inject([SyncService], (service: SyncService) => {
    expect(service).toBeTruthy();
  }));
});
