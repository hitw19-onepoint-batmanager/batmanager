import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import {
  MatSnackBarModule,
  MatToolbarModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatCardModule,
  MatIconModule
} from "@angular/material";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SyncService } from "./services/Sync.service";
import { ConnectivityService } from "./services/Connectivity.service";
import { LoginComponent } from "./login/login.component";
import { DeviceListComponent } from "./device-list/device-list.component";
import { ObservationComponent } from "./observation/observation.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { LocalStorageService } from "./services/local-storage.service";
import { UserService } from "./services/user.service";
import { ObservationFormComponent } from "./observation-form/observation-form.component";
import { EnumToArrayPipe } from "./pipes/enumToArray.pipe";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { ObservationEndComponent } from "./observation-end/observation-end.component";
import { GMapComponent } from "./g-map/g-map.component";
import { AgmCoreModule } from "@agm/core";

@NgModule({
   declarations: [
      AppComponent,
      LoginComponent,
      DeviceListComponent,
      ObservationComponent,
      PageNotFoundComponent,
      ObservationFormComponent,
      EnumToArrayPipe,
      ObservationEndComponent,
      GMapComponent
   ],
   imports: [
      BrowserModule,
      CommonModule,
      FormsModule,
      AppRoutingModule,
      HttpClientModule,
      MatSnackBarModule,
      MatToolbarModule,
      BrowserAnimationsModule,
      MatButtonModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatCheckboxModule,
      MatCardModule,
      MatIconModule,
      AgmCoreModule.forRoot({
        apiKey: "<your-gmap-api-key>"
      }),
      ServiceWorkerModule.register("/ngsw-worker.js", {enabled: environment.production})
   ],
   bootstrap: [
      AppComponent
   ],
   providers: [
      SyncService,
      ConnectivityService,
      LocalStorageService,
      UserService
   ]
})
export class AppModule {}
