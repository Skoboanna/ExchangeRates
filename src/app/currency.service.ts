import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient) { }

  getCurrencies(): Observable<any> {
    return this.http.get("https://api.exchangeratesapi.io/latest")
      .pipe(
        map((response: JSON) => {
          console.log(response);
          return response;
        }))
  }

  getCurrenciesByBase(baseCurrency: string): Observable<any> {
    return this.http.get(`https://api.exchangeratesapi.io/latest?base=${baseCurrency}`)
      .pipe(
        map((response: JSON) => {
          return response;
        })
      );

  }
}
