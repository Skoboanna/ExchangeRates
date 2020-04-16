import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../currency.service';
import { Currency } from '../currency.model';

@Component({
  selector: 'currency-table',
  templateUrl: './currency-table.component.html',
  styleUrls: ['./currency-table.component.scss']
})
export class CurrencyTableComponent implements OnInit {
  public currencies: Currency[];
  public selectedBaseCurrency: string;
  public dateRangeCurrencies: any;
  private displayedColumns: string[];

  constructor(private currencyService: CurrencyService) { }

  ngOnInit() {
    this.displayedColumns = ['type', 'value', 'diff', 'icon'];;
    this.getCurrencies();
  }

  getCurrencies() {
    let today = new Date();
    let todayString = new Date().toISOString().slice(0, 10);
    let startDate = new Date(today.setDate(today.getDate() - 7))
    let startDateString = startDate.toISOString().substring(0, 10);

    this.currencyService.getRatesForTimePeriod(startDateString, todayString).subscribe(rates => {
      this.currencyService.setCurrentRates(this.currencyService.sortObjectByKeys(rates));
      this.currencies = this.currencyService.ratesToday;
    });
  }

  updateCurrencies() {
    let today = new Date();
    let todayString = new Date().toISOString().slice(0, 10);
    let startDate = new Date(today.setDate(today.getDate() - 7))
    let startDateString = startDate.toISOString().substring(0, 10);

    this.currencyService.getCurrenciesByBase(this.selectedBaseCurrency, startDateString, todayString).subscribe(rates => {
      this.currencyService.setCurrentRates(this.currencyService.sortObjectByKeys(rates));
      this.currencies = this.currencyService.ratesToday;
    });
  }

  logCurrencies() { }


}
