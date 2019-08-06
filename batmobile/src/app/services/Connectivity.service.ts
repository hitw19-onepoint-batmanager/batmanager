import { Injectable } from "@angular/core";

@Injectable()
export class ConnectivityService {
  constructor() {}
  onOnline(action) {
    window.addEventListener("online", action);
  }
  onOffline(action) {
    window.addEventListener("offline", action);
  }
}
