import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatTable } from '@angular/material';
import { DataService } from '../services/data.service';
import { BatCrew } from '../models/batcrew';

@Component({
  selector: 'app-crew-management',
  templateUrl: './crew-management.component.html',
  styleUrls: ['./crew-management.component.css']
})
export class CrewManagementComponent implements OnInit {
  crew: BatCrew;
  dataSource = new MatTableDataSource<BatCrew>();
  columnsToDisplay = ['id', 'Area', 'Phone', 'actions'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatTable, {static: true}) table: MatTable<BatCrew>;

  constructor(private dataService: DataService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.crew = {
      id: '',
      Area: '',
      Phone: '',
    } as any;
    this.dataSource.data = [];
    this.dataSource.paginator = this.paginator;
    this.dataService.listener.subscribe(
      (e) => {
        if (e.dbName === 'batcrew' && e.status === 'change') {
          this.applyChanges(e.data);
        }
      }
    );
    this.loadCrew();
  }

  loadCrew() {
    this.dataService.getCrewMembers().then(
      (a: any) => {
        console.log(a);
        this.dataSource.data = a.rows.map(l => l.doc);
      }
    );
  }

  getDatasource(): MatTableDataSource<BatCrew> {
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
              console.log('deleted');
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

  async addCrew() {
    if (this.crew.id) {
      await this.dataService.addUpdateCrew({
        _id: this.crew.id,
        _rev: this.crew._rev,
        id: this.crew.id,
        Area: this.crew.Area,
        Phone: this.crew.Phone,
      });
      this.changeDetector.detectChanges();
      this.clearForm();
    }
  }

  editCrew(element: BatCrew) {
    this.crew = element;
  }

  deleteCrew(element: BatCrew) {
    this.dataService.removeCrew(element).then(
      (e) => {
        const idx = this.dataSource.data.map(d => d._id).indexOf(element._id);
        if (idx !== -1) {
          this.dataSource.data.splice(idx, 1);
          this.changeDetector.detectChanges();
        }
      }
    );
  }

  clearForm() {
    this.crew = {} as any;
  }
}
