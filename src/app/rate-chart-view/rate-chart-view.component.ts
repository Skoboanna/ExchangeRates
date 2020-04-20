import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-rate-chart-view',
  templateUrl: './rate-chart-view.component.html',
  styleUrls: ['./rate-chart-view.component.scss']
})
export class RateChartViewComponent implements OnInit {

  constructor(private currencyService: CurrencyService) { }
  symbol: string;
  baseSymbol: string;
  baseCurrencyChangeSubscriber: any;

  ngOnInit() {
    this.symbol = 'EUR';
    this.baseSymbol = this.currencyService.baseCurrencySymbol;
    this.baseCurrencyChangeSubscriber = this.currencyService.onBaseCurrencyChanged.subscribe(symbol => {
      this.baseSymbol = symbol;
      console.log("VIEW: " + this.baseSymbol);
    });
  }

  ngOnDestroy() {
    this.baseCurrencyChangeSubscriber.unsubscribe();
  }
}
