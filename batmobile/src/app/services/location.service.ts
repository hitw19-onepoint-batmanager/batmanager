import { Injectable } from "@angular/core";
import { Observation, Coords } from "../models";
import { HttpClient } from "@angular/common/http";
import { getMatFormFieldPlaceholderConflictError } from "@angular/material";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class LocationService {
  coord: any;
  response: Subject<Coords> = new Subject();

  async getCoords(): Promise<Coords> {
    const permStatus = await navigator.permissions.query({
      name: "geolocation"
    });
    if (permStatus.state === "granted") {
      console.log("granted");
      const coord = await this.getLocationFromNavigator();
      console.log(coord);
      return coord;
    } else if (permStatus.state === "denied") {
      console.log("denied");
      return null;
    } else if (permStatus.state === "prompt") {
      console.log("prompt");
      const coord = await this.getLocationFromNavigator();
      return coord;
    }
  }

  getLocationFromNavigator(): Promise<Coords> {
      this.response = new Subject();
      this.coord = {};

      navigator.geolocation.getCurrentPosition(
        (coordinates) => {
          this.coord.coordX = coordinates.coords.longitude;
          this.coord.coordY = coordinates.coords.latitude;
          this.response.next(this.coord);
          this.response.complete();
        }, (err) => {
          this.response.next(null);
          this.response.complete();
        });

      return this.response.toPromise();

  }
  constructor(private httpClient: HttpClient) {
    if (!navigator.geolocation) {
      alert("La géolocalisation est désactivée");
    }
  }
}
