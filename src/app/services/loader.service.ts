import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  private isLoading: boolean = false;
  loadingStatus: EventEmitter<boolean> = new EventEmitter();

  startLoading() {
    this.isLoading = true;
    this.loadingStatus.emit(this.isLoading);
  }

  stopLoading() {
    this.isLoading = false;
    this.loadingStatus.emit(this.isLoading);
  }
}
