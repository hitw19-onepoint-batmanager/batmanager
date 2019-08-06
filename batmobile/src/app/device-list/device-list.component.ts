import { Component, OnInit } from "@angular/core";
import { Device } from "../models";
import { SyncService } from "../services/Sync.service";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-device-list",
  templateUrl: "./device-list.component.html",
  styleUrls: ["./device-list.component.css"]
})
export class DeviceListComponent implements OnInit {
  devices: Device[] = [];
  selectedDevice: Device;
  constructor(
    private syncService: SyncService,
    private userService: UserService,
    private router: Router
  ) {
    if (localStorage.getItem("user")) {
      console.log("connected");
    } else {
      this.router.navigateByUrl("/login");
    }
  }
  async ngOnInit() {
    // TODO Get devices allocated to me from batcave from Local Storage
    const user = this.userService.user;
    console.log(user);
    const data = await this.syncService.getDevices();
    data.rows
      .map(({doc}) => doc)
      .filter(
        (r: { AllocatedToCrewId: string }) =>
          r.AllocatedToCrewId === user.userName
      )
      .map(({id}) => id)
      .forEach((element: string) => {
        this.devices.push({ name: element });
      });
  }
  pickDevice(device: Device) {
    this.selectedDevice = device;
  }
}
