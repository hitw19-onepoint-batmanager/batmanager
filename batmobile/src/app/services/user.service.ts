import { Injectable } from "@angular/core";
import { User } from "../models";
import { SyncService } from "./Sync.service";

@Injectable()
export class UserService {
  user: User;
  get isLoggedIn() {
    return localStorage.getItem("user") !== null && localStorage.getItem("user") !== undefined;
  }
  logout() {
    this.user = { userName: null, password: null };
    localStorage.removeItem("user");
  }
  async login(user: User): Promise<boolean> {
    if (this.isLoggedIn) {
      return;
    }
    try {
      const authenticatedUser = await this.syncService.getUsers(user.userName);
      if (authenticatedUser) {
        this.user = user;
        localStorage.setItem("user", JSON.stringify(this.user));
        return new Promise((r) => {
          return r(true);
        });
      }
    } catch (ex) {
      return new Promise((r) => {
        return r(false);
      });
    }
  }
  constructor(private syncService: SyncService) {
    if (localStorage.getItem("user") !== null && localStorage.getItem("user") !== undefined) {
      this.user = JSON.parse(localStorage.getItem("user"));
    } else {
      this.user = { userName: null, password: null };
    }
  }
}
