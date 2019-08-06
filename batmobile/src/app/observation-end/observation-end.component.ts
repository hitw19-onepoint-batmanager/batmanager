import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Observation } from "../models";


const OperationTypesTranslations = {
  Idle: "Commencer l'enregistrement",
  Ongoing: "Arrêter l'enregistrement",
  Done: "-"
};

@Component({
  selector: "app-observation-end",
  templateUrl: "./observation-end.component.html",
  styleUrls: ["./observation-end.component.css"]
})
export class ObservationEndComponent implements OnInit {

  @Input()
  observation: Observation;
  @Output()
  observationChanged = new EventEmitter<Observation>();
  get OperationName() {
    return (
      this.observation && OperationTypesTranslations[this.observation.status]
    );
  }
  constructor() { }

  ngOnInit() {
  }

  onClickObservationForm() {
    const endDate = new Date();
    this.observation.dateEnd = endDate;
    this.observationChanged.emit(this.observation);
  }

}
