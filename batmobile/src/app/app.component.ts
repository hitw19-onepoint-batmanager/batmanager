import { Component, OnInit } from "@angular/core";
import { Router, RouterEvent } from "@angular/router";
import { UserService } from "./services/user.service";
import { MatSnackBar } from "@angular/material";
import { ConnectivityService } from "./services/Connectivity.service";

type OperationType = "stop" | "start";
const OperationTypesTranslations = {
  start: "Commencer l'enregistrement",
  stop: "Arrêter l'enregistrement"
};

@Component({
  selector: "app-root",
  styleUrls: [
    "./app.component.scss"
  ],
  templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.connectivityService.onOnline(e => this.snackBar.dismiss());
    this.connectivityService.onOffline(e => this.notifyConnectionLost());
  }
  notifyConnectionLost() {
    this.snackBar.open("Vous êtes hors ligne.", "Fermer", { duration: 15000 });
  }
  logout() {
    this.userService.logout();
    this.router.navigateByUrl("/login");
  }

  isConnected() {
    return this.IsLoggedIn;
  }


  constructor(
    private router: Router,
    private userService: UserService,
    private connectivityService: ConnectivityService,
    private snackBar: MatSnackBar
  ) {
    router.events.subscribe({
      next(e: RouterEvent) {
        // tslint:disable-next-line:no-unused-expression
        e.url;
      }
    });
  }
  get IsLoggedIn() {
    return this.userService.isLoggedIn;
  }
}
