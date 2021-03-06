import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { Currency } from '../models/currency.model';
import { BehaviorSubject } from 'rxjs';
import { EventEmitter } from '@angular/core';

import { getOrderedListOfObjects } from '../utilities/utils';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  public ratesToday: Currency[] = [];
  public ratesYesterday: any = [];
  baseCurrency$ = new BehaviorSubject<Currency[]>(this.ratesToday);
  onBaseCurrencyChanged = new EventEmitter();
  baseCurrencySymbol: string;

  constructor(private http: HttpClient) { }

  updateExchangeRates(baseCurrency: string, dateFrom: string, dateTo: string) {
    this.getBaseRates(baseCurrency, dateFrom, dateTo).subscribe(rates => {
      this.setRates(rates);
    });
    this.baseCurrencySymbol = baseCurrency;
  }

  initExchangeRates(baseCurrency: string, dateFrom: string, dateTo: string) {
    this.getEuroRatesForTimePeriod(dateFrom, dateTo).subscribe(rates => {
      this.setRates(rates);
    });
    this.baseCurrencySymbol = baseCurrency;
  }

  setRates(rates) {
    this.setCurrentRates(getOrderedListOfObjects(rates));
    this.baseCurrency$.next(this.ratesToday);
  }

  getBaseRates(baseCurrency: string, dateFrom: string, dateTo: string): Observable<any> {
    return this.http.get(`https://api.exchangeratesapi.io/history?start_at=${dateFrom}&end_at=${dateTo}&base=${baseCurrency}`)
      .pipe(
        pluck('rates')
      );
  }

  getEuroRatesForTimePeriod(dateFrom: string, dateTo: string): Observable<JSON> {
    return this.http.get(`https://api.exchangeratesapi.io/history?start_at=${dateFrom}&end_at=${dateTo}`)
      .pipe(
        pluck('rates')
      );
  }

  getRatesByBaseAndSymbol(dateFrom: string, dateTo: string, base: string, symbol: string): Observable<JSON> {
    return this.http.get(`https://api.exchangeratesapi.io/history?start_at=${dateFrom}&end_at=${dateTo}&base=${base}&symbols=${symbol}`)
      .pipe(
        pluck('rates')
      );
  }

  setCurrentRates(ratesByDate) {
    let todayKey = Object.keys(ratesByDate).pop();
    let yesterdayKey = Object.keys(ratesByDate)[Object.keys(ratesByDate).length - 2];

    this.ratesToday = this.mapToCurrencyList(ratesByDate[todayKey]);
    this.ratesYesterday = this.mapToCurrencyList(ratesByDate[yesterdayKey]);

    this.calculateSpotDifference();
  }

  calculateSpotDifference() {
    this.ratesToday.map((currency, index) => {
      currency.diff = +(currency.rate - this.ratesYesterday[index].rate).toFixed(6) // TODO to change (may cause performance issues)
      currency.percentageDiff = +((currency.rate - this.ratesYesterday[index].rate) / currency.rate * 100).toFixed(3)
    });

    this.ratesToday.forEach(rate => {
      rate.icon = this.setIconName(rate.diff);
    });
  }

  mapToCurrencyList(objectToMap): Currency[] {
    return Object.entries(objectToMap).map(
      ([k, v]) => (<Currency>{ type: k, rate: v, diff: 0 })
    );
  }

  setIconName(spot): string {
    if (spot == 0) {
      return 'trending_flat';
    } else if (spot < 0) {
      return 'trending_down';
    } else {
      return 'trending_up';
    }
  }
}
