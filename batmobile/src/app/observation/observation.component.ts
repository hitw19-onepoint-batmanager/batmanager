import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { SyncService } from "../services/Sync.service";
import { MatSnackBar } from "@angular/material";
import { ConnectivityService } from "../services/Connectivity.service";
import { Device, Observation, DarkKnight, Coords } from "../models";
import { LocalStorageService } from "../services/local-storage.service";
import { LocationService } from "../services/location.service";
import { UserService } from "../services/user.service";
type ObservationStatus = "Idle" | "Ongoing" | "Done";


@Component({
  selector: "app-observation",
  templateUrl: "./observation.component.html",
  styleUrls: ["./observation.component.css"]
})
export class ObservationComponent implements OnInit, OnChanges {

  constructor(
    private syncService: SyncService,
    private snackBar: MatSnackBar,
    private connectivityService: ConnectivityService,
    private localStorageService: LocalStorageService,
    private locationService: LocationService,
    private userService: UserService
  ) {}
  @Input()
  device: Device;
  observation: Observation;
  hasObservation: boolean;
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    // tslint:disable-next-line:no-string-literal
    const deviceChange = changes["device"];
    if (deviceChange.currentValue !== deviceChange.previousValue) {
      await this.initializeObservation();
    }
  }
  async ngOnInit(): Promise<void> {
    await this.initializeObservation();
  }
  private async initializeObservation() {
    this.observation =
      this.localStorageService.getById(this.device.name) ||
      (await this.createObservation());
  }

  async createObservation(): Promise<Observation> {
    const startDate = new Date();
    const observation = {
      _id: `${this.device.name}_${startDate.getTime()}`,
      status: "Idle",
      nights: this.initializeNight(),
      deviceName: this.device.name,
      micNumber: null,
      fixedPointProtocol: true,
      pointNumber: 0,
      user: this.userService.user.userName,
      dateStart: startDate,
      dateEnd: null,
      sites: null,
      dominantHabitat: null,
      principalStructuringElement: null,
      secundaryStructuringElement: null,
      management: null,
      lighting: false,
      dropHeight: 0,
      Comments: null
    };
    const coord = await this.locationService.getCoords();
    return {
      ...observation as unknown as Observation,
      ...(coord)
    };
  }
  private initializeNight(): DarkKnight[] {
    return [{ date: new Date(), weather: null }];
  }

  async toggleAction(observation: Observation) {
    const nextStatuses: { [key in ObservationStatus]?: ObservationStatus } = {
      Idle: "Ongoing",
      Ongoing: "Done"
    };
    if (["Idle", "Ongoing"].includes(observation.status)) {
      observation.status = nextStatuses[observation.status];
      const res = await this.syncService.sendObservation(observation);
      if (observation.status === "Done") {
        this.localStorageService.remove(observation.deviceName);
        await this.initializeObservation();
      } else {
        this.localStorageService.insert(this.observation.deviceName, this.observation);
      }
    }
  }

  hasCurrentObservation() {
    const v = this.localStorageService.getById(this.device.name);
    return  v !== null && v !== undefined;
  }
}
