import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { DeviceListComponent } from "./device-list/device-list.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "devices", component: DeviceListComponent },
  { path: "**", component: LoginComponent },
  { path: "", component: LoginComponent}
];

@NgModule({
   imports: [
      RouterModule.forRoot(routes)
   ],
   exports: [
      RouterModule
   ],
   declarations: [
   ]
})
export class AppRoutingModule {}
