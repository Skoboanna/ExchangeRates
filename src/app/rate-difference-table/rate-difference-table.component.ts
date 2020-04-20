import { Component, OnInit } from '@angular/core';
import { Currency } from '../models/currency.model';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'rate-difference-table',
  templateUrl: './rate-difference-table.component.html',
  styleUrls: ['./rate-difference-table.component.scss']
})
export class RateDifferenceTableComponent implements OnInit {

  constructor(private currencyService: CurrencyService) { }
  currencies: Currency[] = [];
  displayedColumns: string[] = [];
  selectedDiffValue: string;
  currenciesIncrease: Currency[] = [];
  currenciesDecrease: Currency[] = [];

  ngOnInit() {
    this.displayedColumns = ['type', 'diff', 'value'];
    this.selectedDiffValue = "increase";

    this.currencyService.baseCurrency$.subscribe(rates => {
      this.currencies = rates.filter(currency => currency.rate !== 1);
      this.currenciesIncrease = this.sortRatesByDiff(this.currencies, this.compareIncrease);
      this.currenciesIncrease = this.currenciesIncrease.slice(0, 5);
      this.currenciesDecrease = this.sortRatesByDiff(this.currencies, this.compareDecrease);
      this.currenciesDecrease = this.currenciesDecrease.slice(0, 5);
      this.onSelectedDiffValueChange(this.selectedDiffValue);
    });
  }

  onSelectedDiffValueChange(value) {
    this.selectedDiffValue = value;

    if (value === "increase") {
      this.currencies = this.currenciesIncrease;
    } else if (value === "decrease") {
      this.currencies = this.currenciesDecrease;
    }
  }

  sortRatesByDiff(rates, compareFunction) {
    let sortedRates = rates;
    sortedRates.sort(compareFunction);
    return sortedRates;
  }

  compareDecrease(rate1, rate2) {
    return rate1.percentageDiff - rate2.percentageDiff;
  }

  compareIncrease(rate1, rate2) {
    return rate2.percentageDiff - rate1.percentageDiff;
  }
}
