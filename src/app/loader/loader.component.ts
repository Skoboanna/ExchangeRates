import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  isLoading: boolean = false;
  loadingSubscription: Subscription;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loadingSubscription = this.loaderService.loadingStatus.pipe(
      debounceTime(200)
    ).subscribe((value) => {
      this.isLoading = value;
    });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

}
