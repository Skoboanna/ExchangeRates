import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { Currency } from '../models/currency.model';
import { sortObjectByKeys, getDateFromToday } from '../utilities/utils';

@Component({
  selector: 'currency-table',
  templateUrl: './currency-table.component.html',
  styleUrls: ['./currency-table.component.scss']
})
export class CurrencyTableComponent implements OnInit {
  public currencies: Currency[];
  public selectedBaseCurrency: string;
  public dateRangeCurrencies: any;
  public displayedColumns: string[];
  private startDate: string;
  private endDate: string;

  constructor(private currencyService: CurrencyService) { }

  ngOnInit() {
    this.displayedColumns = ['type', 'value', 'diff', 'icon'];
    this.startDate = getDateFromToday(7);
    this.endDate = getDateFromToday(0);
    this.getExchangeRates();
  }

  getExchangeRates() {
    this.currencyService.getEuroRatesForTimePeriod(this.startDate, this.endDate).subscribe(rates => {
      this.setRates(rates);
    });
  }

  updateExchangeRates() {
    this.currencyService.getBaseRates(this.selectedBaseCurrency, this.startDate, this.endDate).subscribe(rates => {
      this.setRates(rates);
    });
  }

  setRates(rates) {
    this.currencyService.setCurrentRates(sortObjectByKeys(rates));
    this.currencies = this.currencyService.ratesToday;
  }

  logCurrencies() { }
}
