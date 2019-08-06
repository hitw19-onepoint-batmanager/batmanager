import { Component, OnInit } from "@angular/core";
import { User } from "../models";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { PwaService } from "../services/pwa.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  constructor(private userService: UserService, private router: Router, private snackBar: MatSnackBar, public Pwa: PwaService) {}

  user: User;

  displayInstallBtn: boolean;

  ngOnInit() {
    this.displayInstallBtn = true;
    this.user = this.userService.user;
    if (this.user.userName) {
      this.router.navigateByUrl("/devices");
    }
  }

  async onLogin() {
    const res = await this.userService.login(this.user);
    if (res) {
      this.onSuccessLogin();
    } else {
      this.onErrorLogin();
    }
  }

  onSuccessLogin() {
    this.router.navigateByUrl("/devices");
  }

  onErrorLogin() {
    this.snackBar.open("Mot de passe ou identifiant incorrect", "Ok", {
      duration: 2000
    });
  }

  installPwa() {
    if (this.Pwa.promptEvent) {
      this.Pwa.promptEvent.prompt();
    } else {
      this.displayInstallBtn = false;
    }
  }

  isPwa() {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return true;
    } else {
      return false;
    }
  }
}
