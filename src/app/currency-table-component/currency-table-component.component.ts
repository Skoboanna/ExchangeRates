import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../currency.service';

export interface Currency {
  type: string;
  value: number;
}

@Component({
  selector: 'currency-table',
  templateUrl: './currency-table-component.component.html',
  styleUrls: ['./currency-table-component.component.scss']
})
export class CurrencyTableComponentComponent implements OnInit {

  constructor(private currencyService: CurrencyService) { }
  public currencies: Currency[];
  public selectedBaseCurrency: string;

  ngOnInit() {
    this.getCurrencies();
  }

  getCurrencies() {
    this.currencyService.getCurrencies().subscribe(currencies => {
      this.currencies = Object.entries(currencies.rates).map(([k, v]) => (<Currency>{ type: k, value: v }));
    });
  }

  getCurrenciesByBase() {
    this.currencyService.getCurrenciesByBase(this.selectedBaseCurrency).subscribe(currencies => {
      this.currencies = Object.entries(currencies.rates).map(([k, v]) => (<Currency>{ type: k, value: v }));
    });
    console.log('dsd');
  }

  logCurrencies() {
    console.log(this.currencies);
    console.log(this.selectedBaseCurrency);
  }

  displayedColumns: string[] = ['type', 'value'];
}
