import { Injectable, OnInit, EventEmitter } from "@angular/core";
import PouchDB from "pouchdb";
import { Observation } from "../models";
import { environment } from "src/environments/environment";

@Injectable()
export class SyncService {

  listener: EventEmitter<any> = new EventEmitter();
  private readonly batGarage = new PouchDB("batgarage");
  private readonly batDevices = new PouchDB("batdevices");
  private readonly batCrew = new PouchDB("batcrew");
  private queue: IObservation[] = [];

  constructor() {
    let url = "";
    if (environment.production) {
      console.log("prod");
      url = "<prod-couchdb-remote-url>";
    } else {
      console.log("dev");
      url = "<debug-couchdb-remote-url>";
    }
    this.sync(this.batGarage, url + "batgarage");
    this.sync(this.batDevices, url + "batdevices");
    this.sync(this.batCrew, url + "batcrew");
  }

  sendObservation(observation: any) {
    this.batGarage.get(observation._id).then(
      (obs) => {
        observation._rev = obs._rev;
        this.batGarage.put(observation).then(
          (suc) => console.log("updated", suc)
        );
      }
    ).catch(
      (err) => {
        if (err.status === 404 && err.name === "not_found") {
          this.batGarage.put(observation).then(
            (suc) => console.log("saved", suc)
          );
        }
      }
    );
  }

  getDevices() {
    return this.batDevices.allDocs({
      include_docs: true,
      attachments: false
    });
  }

  getUsers(username): Promise<any> {
    return this.batCrew.get(username);
  }

  sync(local: PouchDB, remote: string) {
    const remoteDatabase = new PouchDB(remote);
    PouchDB.sync(local, remoteDatabase, {
      live: true,
      retry: true
    })
      .on("change", change => {
        this.listener.emit({
          status: "change",
          data: change,
          dbName: local.name
        });
      })
      .on("complete", info => {
        this.listener.emit({
          status: "complete",
          data: info,
          dbName: local.name
        });
      })
      .on("paused", err => {
        this.listener.emit({ status: "paused", data: err, dbName: local.name });
        // replication paused, offline or up to date
      })
      .on("active", () => {
        this.listener.emit({
          status: "active",
          data: null,
          dbName: local.name
        });
        // replicate resumed, online, new changes
      })
      .on("error", error => {
        this.listener.emit({
          status: "error",
          data: error,
          dbName: local.name
        });
        console.error(JSON.stringify(error));
      });
  }
}

interface IObservation {
  type: "start" | "end";
  timestamp: number;
}

class Connectivity {
  isConnected: boolean;
}
