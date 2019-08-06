import {
  Component,
  OnInit,
  OnChanges,
  Input,
  SimpleChanges,
  Output,
  EventEmitter
} from "@angular/core";
import { SyncService } from "../services/Sync.service";
import { LocalStorageService } from "../services/local-storage.service";
import { LocationService } from "../services/location.service";
import { UserService } from "../services/user.service";
import {
  Device,
  Observation,
  DarkKnight,
  PrincipalStructuringElement,
  SecondaryStructuringElement,
  Management
} from "../models";
import { DominantHabitat } from "../models";
import { EnumToArrayPipe } from "../pipes/enumToArray.pipe";

const OperationTypesTranslations = {
  Idle: "Commencer l'enregistrement",
  Ongoing: "Arrêter l'enregistrement",
  Done: "Nouvel enregistrement"
};
@Component({
  selector: "app-observation-form",
  templateUrl: "./observation-form.component.html",
  styleUrls: ["./observation-form.component.css"]
})
export class ObservationFormComponent {
  get OperationName() {
    return (
      this.observation && OperationTypesTranslations[this.observation.status]
    );
  }
  dominantHabitats = DominantHabitat;
  principalStructuringElements = PrincipalStructuringElement;
  secondaryStructuringElements = SecondaryStructuringElement;
  managements = Management;
  @Input()
  observation: Observation;
  @Output()
  observationChanged = new EventEmitter<Observation>();
  constructor(
    private syncService: SyncService,
    private localStorageService: LocalStorageService,
    private locationService: LocationService,
    private userService: UserService
  ) {}

  onSubmitObservationForm() {
    this.observationChanged.emit(this.observation);
  }
}
