import {
  Component, OnInit, ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  Input
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
  dateRangeCurrencies: any;
  displayedColumns: string[];
  showChart: boolean = true;

  @Input() baseSymbol: string;

  constructor(private currencyService: CurrencyService, private resolver: ComponentFactoryResolver) { }
  @ViewChild("rateChartPopupContainer", { read: ViewContainerRef, static: false }) container: ViewContainerRef;
  componentRef: ComponentRef<any>;

  ngOnInit() {
    this.displayedColumns = ['type', 'value', 'diff', 'icon', 'chart'];
    this.baseSymbol = this.currencyService.baseCurrencySymbol;

    this.currencyService.baseCurrency$.subscribe(rates => {
      this.currencies = rates;
      this.currencies = this.currencies.filter(currency => currency.rate !== 1);
    });

    this.currencyService.onBaseCurrencyChanged.subscribe(baseCurrencySymbol => this.baseSymbol = baseCurrencySymbol);
  }

  createComponent(symbol) {
    this.showChart = true;
    const factory = this.resolver.resolveComponentFactory(RatePopupComponent);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.symbol = symbol;
    this.componentRef.instance.baseSymbol = this.baseSymbol;
    this.componentRef.instance.chartLegend = false;
    this.componentRef.instance.close.subscribe(value => {
      this.componentRef.destroy();
    }
    );
  }

  ngOnDestroy() {
    this.componentRef.destroy();
  }
}
