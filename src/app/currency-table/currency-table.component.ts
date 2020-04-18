import {
  Component, OnInit, ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef
} from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { Currency } from '../models/currency.model';

import { RatePopupComponent } from '../rate-popup/rate-popup.component';

@Component({
  selector: 'currency-table',
  templateUrl: './currency-table.component.html',
  styleUrls: ['./currency-table.component.scss']
})
export class CurrencyTableComponent implements OnInit {
  currencies: Currency[];
  selectedBaseCurrency: string;
  dateRangeCurrencies: any;
  displayedColumns: string[];
  showChart: boolean = true;

  constructor(private currencyService: CurrencyService, private resolver: ComponentFactoryResolver) { }
  @ViewChild("alertContainer", { read: ViewContainerRef, static: false }) container: ViewContainerRef;
  componentRef: ComponentRef<any>;

  ngOnInit() {
    this.displayedColumns = ['type', 'value', 'diff', 'icon', 'chart'];

    this.currencyService.baseCurrency$.subscribe(rates => {
      this.currencies = rates;
    });
  }

  createComponent(type) {
    this.showChart = true;
    const factory = this.resolver.resolveComponentFactory(RatePopupComponent);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.type = type;
    this.componentRef.instance.close.subscribe(value => {
      this.componentRef.destroy();
    }
    );
  }

  ngOnDestroy() {
    this.componentRef.destroy();
  }
}
