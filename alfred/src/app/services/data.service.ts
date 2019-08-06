import { Injectable, EventEmitter } from '@angular/core';
import PouchDB from 'pouchdb';
import { BatDevice } from '../models/batdevice';
import { BatCrew } from '../models/batcrew';
import PouchDBFind from 'pouchdb-find';
import { environment } from 'src/environments/environment';
PouchDB.plugin(PouchDBFind);

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private db: PouchDB;
  private crewDb: PouchDB;
  private deviceDb: PouchDB;
  private garageDb: PouchDB;
  listener: EventEmitter<any> = new EventEmitter();

  constructor() {
    let url = '';
    if (environment.production) {
      console.log('prod');
      url = '<prod-couchdb-remote-url>';
    } else {
      console.log('dev');
      url = '<debug-couchdb-remote-url>';
    }
    this.db = new PouchDB('batcave');
    this.crewDb = new PouchDB('batcrew');
    this.deviceDb = new PouchDB('batdevices');
    this.garageDb = new PouchDB('batgarage');
    this.sync(this.db, url + 'batcave');
    this.sync(this.crewDb, url + 'batcrew');
    this.sync(this.deviceDb, url + 'batdevices');
    this.sync(this.garageDb, url + 'batgarage');
  }

  // Robin data
  getRecordingInfos(): Promise<any> {
    return this.db.allDocs({
      include_docs: true,
      attachments: false
    });
  }

  getAudioAttachment(id): Promise<any> {
    return this.db.getAttachment(id, 'SoundFile');
  }

  // Batmobile data
  getUserTimeFrames(deviceName): Promise<any> {
    return this.db.get(deviceName);
  }

  getCrewMembers(): Promise<any> {
    return this.crewDb.allDocs({
      include_docs: true,
      attachments: false
    });
  }

  addUpdateCrew(batcrew: BatCrew): Promise<any> {
    return this.crewDb.put(batcrew);
  }

  removeCrew(batcrew: BatCrew): Promise<any> {
    return this.deviceDb.remove(batcrew._id, batcrew._rev);
  }

  getDevices(): Promise<any> {
    return this.deviceDb.allDocs({
      include_docs: true,
      attachments: false
    });
  }

  addUpdateDevice(batdevice: BatDevice): Promise<any> {
    return this.deviceDb.put(batdevice);
  }

  removeDevice(batdevice: BatDevice): Promise<any> {
    return this.deviceDb.remove(batdevice._id, batdevice._rev);
  }

  getMobileMetadata(nameDevice) {
    return this.garageDb.find({
      selector: { deviceName: nameDevice },
      fields: ['_id', 'deviceName']
    });
  }
  getAllMobileMetadata() {
    return this.garageDb.allDocs({
      include_docs: true,
      attachments: false
  });
  }

  getMobileData(id) {
    return this.garageDb.get(id);
  }

  sync(local: PouchDB, remote: string) {
    const remoteDatabase = new PouchDB(remote);
    PouchDB.sync(local, remoteDatabase, {
      live: true,
      retry: true
    }).on('change', change => {
      this.listener.emit({ status: 'change', data: change, dbName: local.name });
    }).on('complete', info => {
      this.listener.emit({ status: 'complete', data: info, dbName: local.name });
    }).on('paused', (err) => {
      this.listener.emit({ status: 'paused', data: err, dbName: local.name });
      // replication paused, offline or up to date
    }).on('active', () => {
      this.listener.emit({ status: 'active', data: null, dbName: local.name });
      // replicate resumed, online, new changes
    }).on('error', error => {
      this.listener.emit({ status: 'error', data: error, dbName: local.name });
      console.error(JSON.stringify(error));
    });
  }

  dbInfos() {
    return this.db.info();
  }

}
