import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { Currency } from '../models/currency.model';
import { BehaviorSubject } from 'rxjs';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  public ratesToday: Currency[];
  public ratesYesterday: any;
  public baseCurrencySymbol = 'USD';
  baseCurrency$ = new BehaviorSubject<Currency[]>(this.ratesToday);
  onBaseCurrencyChanged = new EventEmitter();

  constructor(private http: HttpClient) { }

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
        map((response: any) => {
          // map response to desired object ??
          console.log(response);
          return response.rates;
        }))
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
      currency.diff = +(currency.rate - this.ratesYesterday[index].rate).toFixed(3) // to change (may cause performance issues)
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
    let icoName;
    if (spot == 0) {
      icoName = 'trending_flat';
    } else if (spot < 0) {
      icoName = 'trending_down';
    } else {
      icoName = 'trending_up';
    }
    return icoName;
  }
}
