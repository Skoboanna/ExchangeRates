import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { Currency } from '../models/currency.model';

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

  constructor(private currencyService: CurrencyService) { }

  ngOnInit() {
    this.displayedColumns = ['type', 'value', 'diff', 'icon'];

    this.currencyService.baseCurrency$.subscribe(rates => {
      this.currencies = rates;
    });
  }
}
