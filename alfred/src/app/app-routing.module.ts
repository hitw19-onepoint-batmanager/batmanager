import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelloworldComponent } from './helloworld/helloworld.component';
import { RecordingInfosComponent } from './recording-infos/recording-infos.component';
import { CrewManagementComponent } from './crew-management/crew-management.component';
import { DeviceManagementComponent } from './device-management/device-management.component';
import { GMapComponent } from './g-map/g-map.component';

const routes: Routes = [
  {
    path: 'crewmanagement', component: CrewManagementComponent
  },
  {
    path: 'devicesmanagement', component: DeviceManagementComponent
  },
  {
    path: 'recordinginfos', component: RecordingInfosComponent
  },
  {
    path: 'home', component: HelloworldComponent
  },
  {
    path: 'map', component: GMapComponent
  },
  {
    path: '**', component: HelloworldComponent
  },
  {
    path: '', component: HelloworldComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
