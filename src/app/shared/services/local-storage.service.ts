import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  private storageSub = new Subject<string>();

  watchStorage(): Subject<string> {
    return this.storageSub;
  }

  setItem(key: string, data: any): void {
    localStorage.setItem(key, data);
    this.storageSub.next('set');
  }

  getItem(key: string): any {
    return localStorage.getItem(key);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
    this.storageSub.next('remove');
  }
}
