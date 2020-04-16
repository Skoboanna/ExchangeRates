import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { CurrencyService } from '../services/currency.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { sortObjectByKeys, getDateFromToday } from '../utilities/utils';

@Component({
  selector: 'rate-chart',
  templateUrl: './rate-chart.component.html',
  styleUrls: ['./rate-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RateChartComponent implements OnInit {
  public chartLabels: Label[];
  public baseCurrencyRates: any[];
  public chartData: ChartDataSets[];
  private startDate: string;
  private endDate: string;

  constructor(private currencyService: CurrencyService) { }

  ngOnInit() {
    this.chartLabels = [];
    this.baseCurrencyRates = [];
    this.chartData = [{ data: this.baseCurrencyRates, label: 'Base currency vs EUR' }];
    this.startDate = getDateFromToday(30);
    this.endDate = getDateFromToday(0);
    this.getRatesByBaseCurrency();
  }

  chartOptions = {
    responsive: true,
  };

  chartColors: Color[] = [{
    borderColor: 'blue'
  }];

  chartLegend = true;
  chartType = 'line';

  getRatesByBaseCurrency() {
    this.currencyService.getRatesByBaseAndSymbol(this.startDate, this.endDate, 'EUR', 'PLN').subscribe(rates => {
      console.log(rates);
      this.chartLabels = this.getChartLabels(rates, this.chartLabels);
      this.baseCurrencyRates = this.getChartData(rates);
      Object.assign(this.chartData[0], { data: this.baseCurrencyRates });
    });
  }

  getChartLabels(rates: object, labelsArray: Label[]) {
    let sortedRates = sortObjectByKeys(rates);
    Object.keys(sortedRates).forEach(date => {
      labelsArray.push(date);
    });
    return labelsArray;
  }

  getChartData(ratesObject: object): number[] {
    let sortedRates = sortObjectByKeys(ratesObject);
    let baseRates = [];

    Object.entries(sortedRates).forEach(([date, rateObject]) => {
      baseRates.push(rateObject);
    });

    baseRates = baseRates.map(rate => {
      return rate.PLN
    });
    return baseRates;
  }
}
