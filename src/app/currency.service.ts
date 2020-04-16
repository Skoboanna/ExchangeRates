import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, finalize, pluck } from 'rxjs/operators';
import { Currency } from './currency.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  public ratesToday: Currency[];
  public ratesYesterday: any;

  constructor(private http: HttpClient) { }

  getCurrencies(): Observable<any> {
    return this.http.get("https://api.exchangeratesapi.io/latest")
      .pipe(
        map((response: any) => {
          this.ratesYesterday = Object.entries(response.rates).map(([k, v]) => (<Currency>{ type: k, value: v, diff: 0 }));
          console.log(response);
          return response;
        }))
  }

  getCurrenciesByBase(baseCurrency: string, dateFrom: string, dateTo: string): Observable<any> {
    return this.http.get(`https://api.exchangeratesapi.io/history?start_at=${dateFrom}&end_at=${dateTo}&base=${baseCurrency}`)
      .pipe(
        pluck('rates')
      );
  }

  getRatesForTimePeriod(dateFrom: string, dateTo: string): Observable<JSON> {
    return this.http.get(`https://api.exchangeratesapi.io/history?start_at=${dateFrom}&end_at=${dateTo}`)
      .pipe(
        pluck('rates')
      );
  }

  setCurrentRates(data) { // change the name...
    let todayKey = Object.keys(data).pop();
    let yesterdayKey = Object.keys(data)[Object.keys(data).length - 2];
    console.log(todayKey);
    console.log(yesterdayKey);

    this.ratesToday = this.mapToCurrencyList(data[todayKey]);
    this.ratesYesterday = this.mapToCurrencyList(data[yesterdayKey]);
    this.calculateSpotDifference();
  }

  calculateSpotDifference() {
    this.ratesToday.map((rate, index) => {
      rate.diff = rate.value - this.ratesYesterday[index].value
    });
  }

  //// utils /////

  sortObjectByKeys(obj): any {
    const sortedObject = {};
    Object.keys(obj).sort().forEach(function (key) {
      sortedObject[key] = obj[key];
    });
    return sortedObject;
  }

  mapToCurrencyList(objectToMap): Currency[] {
    return Object.entries(objectToMap).map(
      ([k, v]) => (<Currency>{ type: k, value: v, diff: 0 })
    );
  }

}
