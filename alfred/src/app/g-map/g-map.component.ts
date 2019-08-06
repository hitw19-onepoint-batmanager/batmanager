import { Component, OnInit, Input } from '@angular/core';
import { MapRestriction } from '@agm/core/services/google-maps-types';
import bl72ToLatLng from 'bl72tolatlng';
import { BatMapLocation } from '../models/batmaplocation';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-g-map',
  templateUrl: './g-map.component.html',
  styleUrls: ['./g-map.component.css']
})
export class GMapComponent implements OnInit {

  @Input()
  set height(h: string) {
    this.heightMap = h;
  }

  @Input()
  set width(w: string) {
    this.widthMap = w;
  }

  @Input()
  set locations(l: []) {
    this.batdevices = l;
  }

  heightMap = '84vh';
  widthMap = '100vw';

  batdevices: BatMapLocation[] = [];

  private batFix = [
    { x: 83500, y: 137500 },
    { x: 103500, y: 122000 },
    { x: 109500, y: 123500 },
    { x: 121500, y: 142000 },
    { x: 121500, y: 137000 },
    { x: 122500, y: 144500 },
    { x: 127500, y: 146000 },
    { x: 148500, y: 142500 },
    { x: 167500, y: 136500 },
    { x: 157500, y: 122000 },
    { x: 150500, y: 114000 },
    { x: 167500, y: 111500 },
    { x: 157500, y: 89500 },
    { x: 162500, y: 94000 },
    { x: 163500, y: 94000 },
    { x: 164500, y: 98000 },
    { x: 146500, y: 81000 },
    { x: 161500, y: 79000 },
    { x: 93500, y: 157500 },
    { x: 111500, y: 153000 },
    { x: 156500, y: 151500 },
    { x: 192500, y: 161500 },
    { x: 203500, y: 153000 },
    { x: 230500, y: 154000 },
    { x: 237500, y: 154500 },
    { x: 245500, y: 155500 },
    { x: 244500, y: 155000 },
    { x: 249500, y: 149500 },
    { x: 251500, y: 151500 },
    { x: 276500, y: 151500 },
    { x: 192500, y: 73500 },
    { x: 201500, y: 79500 },
    { x: 197500, y: 74000 },
    { x: 188500, y: 69000 },
    { x: 213500, y: 68500 },
    { x: 211500, y: 83000 },
    { x: 217500, y: 82000 },
    { x: 225500, y: 40500 },
    { x: 222500, y: 40000 },
    { x: 172500, y: 108000 },
    { x: 191500, y: 103000 },
    { x: 188500, y: 114000 },
    { x: 201500, y: 89000 },
    { x: 197500, y: 94500 },
    { x: 197500, y: 88000 },
    { x: 174500, y: 133000 },
    { x: 170500, y: 137500 },
    { x: 193500, y: 124000 },
    { x: 193500, y: 118000 },
    { x: 186500, y: 131000 },
    { x: 217500, y: 143000 },
    { x: 231500, y: 141000 },
    { x: 233500, y: 122000 },
    { x: 231500, y: 118500 },
    { x: 204500, y: 88000 },
    { x: 204500, y: 90500 },
    { x: 216500, y: 93000 },
    { x: 229500, y: 103000 },
    { x: 233500, y: 85500 },
    { x: 236500, y: 104000 },
    { x: 252500, y: 103000 },
    { x: 253500, y: 100500 },
    { x: 240500, y: 117000 },
    { x: 244500, y: 130500 },
    { x: 243500, y: 118500 },
    { x: 238500, y: 140000 },
    { x: 266500, y: 129500 },
    { x: 278500, y: 104000 },
    { x: 285500, y: 113000 },
    { x: 288500, y: 115500 },
    { x: 237500, y: 29000 },
    { x: 248500, y: 48000 },
    { x: 252500, y: 37500 },
    { x: 252500, y: 45500 },
    { x: 255500, y: 35500 },
  ];
  restriction: MapRestriction;
  showPOI: boolean;
  showDevices: boolean;

  constructor(private dataService: DataService) {
    this.showPOI = true;
    this.showDevices = true;
    // restricted to belgium
    const latLngBound = {
      east: 6.177532, north: 51.414691, south: 49.803599, west: 2.520923
    };
    this.restriction = {
      latLngBounds: latLngBound,
      strictBounds: false
    };
    // conversion belgian lambert 72 to geocode
    this.batFix.forEach(f => {
      const batGpsCoordinates = bl72ToLatLng(f.x, f.y);
      this.batdevices.push(
        {
          lat: batGpsCoordinates.latitude,
          lng: batGpsCoordinates.longitude,
          iconUrl: 'assets/poi.png',
          label: 'Fix Point of Interest',
          type: 'poi'
        }
      );
    });
    this.dataService.getAllMobileMetadata().then(
      (d) => {
        d.rows.forEach(doc => {
          this.dataService.getMobileData(doc.id).then(
            (data) => {
              this.batdevices.push({
                lat: data.coordY,
                lng: data.coordX,
                iconUrl: 'assets/batdevice.png',
                label: data.deviceName,
                type: 'device',
                data
              });
            }
          );
        });
      }
    );
  }

  ngOnInit() {
  }

  triggerPOI() {
    this.showPOI = !this.showPOI;
  }

  triggerDevices() {
    this.showDevices = !this.showDevices;
  }

  getMarkerLocations() {
    const locations = [...this.getAllPOI()];
    locations.push(...this.getAllDevices());
    return locations;
  }

  getAllPOI() {
    if (this.showPOI) {
      return this.batdevices.filter(d => d.type === 'poi');
    } else {
      return [];
    }
  }

  getAllDevices() {
    if (this.showDevices) {
      return this.batdevices.filter(d => d.type === 'device');
    } else {
      return [];
    }
  }

}
