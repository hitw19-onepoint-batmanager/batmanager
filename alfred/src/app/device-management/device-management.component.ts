import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatTable } from '@angular/material';
import { DataService } from '../services/data.service';
import { BatDevice } from '../models/batdevice';
import { Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-device-management',
  templateUrl: './device-management.component.html',
  styleUrls: ['./device-management.component.css'],
})
export class DeviceManagementComponent implements OnInit {

  device: BatDevice;
  dataSource = new MatTableDataSource<BatDevice>();
  columnsToDisplay = ['id', 'AllocatedToCrewId', 'actions'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatTable, {static: true}) table: MatTable<BatDevice>;

  constructor(private dataService: DataService, private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.device = {
      id: '',
      AllocatedToCrewId: '',
    } as any;

    this.dataSource.data = [];
    this.dataSource.paginator = this.paginator;
    this.dataService.listener.subscribe(
      (e) => {
        if (e.dbName === 'batdevices' && e.status === 'change') {
          this.applyChanges(e.data);
        }
      });
    this.loadDevices();
  }

  loadDevices() {
    this.dataService.getDevices().then(
      (a: any) => {
        // todo check id exists
        this.dataSource.data = a.rows.map(l => {
          return l.doc;
        });
        console.log(this.dataSource.data);
      }
    );
  }

  getDatasource(): MatTableDataSource<BatDevice> {
    return this.dataSource;
  }

  applyChanges(data) {
    if (data.direction === 'push') {
      console.log('pushing data', data.change.docs);
      data.change.docs.forEach(
        (d) => {
          const idxDataSource = this.dataSource.data.map(doc => doc._id).indexOf(d._id);
          if (d._deleted === true) {
            if (idxDataSource !== -1) {
              this.dataSource.data.splice(idxDataSource, 1);
            }
        } else {
          if (idxDataSource === -1) {
            // add
            this.dataSource.data.push(d);
          } else {
            // update
            this.dataSource.data.splice(idxDataSource, 1);
            this.dataSource.data.push(d);
          }
        }
          this.dataSource.data = [...this.dataSource.data];
          this.changeDetector.detectChanges();
        }
      );

    }
  }

  async addDevice() {
    if (this.device.id) {
      await this.dataService.addUpdateDevice({
        _id: this.device.id,
        _rev: this.device._rev,
        id: this.device.id,
        AllocatedToCrewId: this.device.AllocatedToCrewId
      });
      this.changeDetector.detectChanges();
      this.clearForm();
    }
  }

  editDevice(element: BatDevice) {
    this.device = element;
  }

  deleteDevice(element: BatDevice) {
    this.dataService.removeDevice(element).then(
      (e) => {
        const idx = this.dataSource.data.map(d => d._id).indexOf(element.id);
        if (idx !== -1) {
          this.dataSource.data.splice(idx, 1);
          this.changeDetector.detectChanges();
        }
      }
    );
  }

  clearForm() {
    this.device = {} as any;
  }
}
