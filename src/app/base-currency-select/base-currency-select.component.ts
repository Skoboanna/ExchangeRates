import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { Currency } from '../models/currency.model';
import { sortObjectByKeys, getDateFromToday } from '../utilities/utils';

@Component({
  selector: 'base-currency-select',
  templateUrl: './base-currency-select.component.html',
  styleUrls: ['./base-currency-select.component.scss']
})
export class BaseCurrencySelectComponent implements OnInit {
  public selectedBaseCurrency: string;
  public currencies: Currency[];
  private startDate: string;
  private endDate: string;

  constructor(private currencyService: CurrencyService) { }

  ngOnInit() {
    console.log("halo, init");
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
    this.currencyService.baseCurrency$.next(this.currencies);
    console.log(this.currencies);
  }
}
