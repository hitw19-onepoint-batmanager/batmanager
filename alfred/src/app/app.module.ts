import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';


import {
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatButtonModule,
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressBarModule,
  MatCardModule,
  MatSelectModule
} from '@angular/material';

import { HelloworldComponent } from './helloworld/helloworld.component';
import { RecordingInfosComponent } from './recording-infos/recording-infos.component';
import { GMapComponent } from './g-map/g-map.component';
import { CrewManagementComponent } from './crew-management/crew-management.component';
import { DeviceManagementComponent } from './device-management/device-management.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HelloworldComponent,
    RecordingInfosComponent,
    GMapComponent,
    RecordingInfosComponent,
    CrewManagementComponent,
    DeviceManagementComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatCardModule,
    AgmCoreModule.forRoot({
      apiKey: '<your-gmap-api-key>'
    }),
    MatSortModule,
    FormsModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
