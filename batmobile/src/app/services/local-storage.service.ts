import { Injectable } from "@angular/core";

@Injectable()
export class LocalStorageService {
  constructor() {}

  getById<T>(id: string): T {
    const item = localStorage.getItem(id);
    return item === undefined ? undefined : JSON.parse(item);
  }
  insert<T>(id: string, item: T) {
    localStorage.setItem(id, JSON.stringify(item));
  }
  remove(id: string) {
    localStorage.removeItem(id);
  }
}
