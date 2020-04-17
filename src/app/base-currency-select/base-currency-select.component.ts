import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { Currency } from '../models/currency.model';
import { getDateFromToday } from '../utilities/utils';

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
    this.startDate = getDateFromToday(7);
    this.endDate = getDateFromToday(0);
    this.initExchangeRates();

    this.currencyService.baseCurrency$.subscribe(rates => {
      this.currencies = rates;
    });
  }

  initExchangeRates() {
    this.currencyService.initExchangeRates(this.startDate, this.endDate);
  }

  updateExchangeRates() {
    this.currencyService.onBaseCurrencyChanged.emit(this.selectedBaseCurrency);
    this.currencyService.updateExchangeRates(this.selectedBaseCurrency, this.startDate, this.endDate);
  }
}
