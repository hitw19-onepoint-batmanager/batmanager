import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { Recording } from '../models/recording';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { ZipService } from '../services/ZipService';
import { BatMapLocation } from '../models/batmaplocation';
import { promise } from 'protractor';

declare const zip: any;
@Component({
  selector: 'app-recording-infos',
  templateUrl: './recording-infos.component.html',
  styleUrls: ['./recording-infos.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RecordingInfosComponent implements OnInit {

  expandedElement: Recording | null;
  dataSource = new MatTableDataSource<Recording>();
  columnsToDisplay = ['timeStamp', 'deviceName', 'username'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  isLoading = false;
  batdevices: BatMapLocation[] = [];

  constructor(private dataService: DataService) {
    console.log(zip);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataService.listener.subscribe(
      (e) => {
        if (e.dbname === 'batcave') {
          this.loadRecordings();
        }
      }
    );
    this.loadRecordings();
    this.isLoading = true;
  }

  loadRecordings() {
    this.dataService.getRecordingInfos().then(
      (a: any) => {
        this.isLoading = false;
        this.dataSource.data = a.rows.map(l => l.doc);
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  download(element: Recording) {
    console.log(element);
    this.dataService.getAudioAttachment(element._id).then(
      (blob) => {
        this.isLoading = false;
        console.log(blob);
        const link = document.createElement('a');
        link.download = element._id;
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    );
    this.isLoading = true;
  }

  downloadAllNight(element: Recording) {
    console.log(element.activeNight);
    const audios = this.dataSource.data.filter(d => d.activeNight === element.activeNight && d.deviceName === element.deviceName);
    console.log(audios);
  }

  expandItem(element) {
    console.log('expanding item ' + element.deviceName);
    // load attachment
    // load map
    this.batdevices = [];
    this.dataService.getMobileMetadata(element.deviceName).then(
      (d) => {
        d.docs.forEach(doc => {
          this.dataService.getMobileData(doc._id).then(
            (data) => {
              console.log(data);
              this.batdevices.push({
                lat: data.coordY,
                lng: data.coordX,
                iconUrl: 'assets/batdevice.png',
                label: data.deviceName,
                type: 'device'
              });
            }
          )
        })

      }
    )
    // display block
    this.expandedElement = this.expandedElement === element ? null : element;
  }
  async downloadall() {
    this.isLoading = true;
    const resultingzip: JSZip = new JSZip();
    const name = 'All.zip';
    const promises = this.dataSource.data.map(async (x, idx) => {
      // Get Current Attachement
      const blob = await this.dataService.getAudioAttachment(x._id);
      await this.extractzip(blob, resultingzip, idx);
    });
    await Promise.all(promises);
    console.log('generating all.zip');
    resultingzip.generateAsync({
      type: 'blob'

    }).then((content) => {
      saveAs(content, name);
    });
    this.isLoading = false;
  }

  async extractzip(blob, resultingzip, index): Promise<void> {
    const reader = new zip.BlobReader(blob);
    const zipReader: any = await new Promise((ok, ko) => zip.createReader(reader, ok));
    const entry: any = await new Promise((ok, ko) => zipReader.getEntries(([x]) => ok(x)));
    console.log(index, entry);
    const writer = new zip.BlobWriter();
    console.log('Entering getData');
    const finalBlob = await new Promise((ok, ko) => entry.getData(writer, ok));
    resultingzip.file(entry.filename, finalBlob);
    // console.log(finalBlob);
  }
}
