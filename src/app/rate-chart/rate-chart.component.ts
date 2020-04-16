import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { CurrencyService } from '../currency.service';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'rate-chart',
  templateUrl: './rate-chart.component.html',
  styleUrls: ['./rate-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RateChartComponent implements OnInit {
  chartLabels: Label[];
  ratesData: any[];
  chartData: ChartDataSets[];

  constructor(private currencyService: CurrencyService) { }

  ngOnInit() {
    this.chartLabels = [];
    this.ratesData = [];
    this.chartData = [{ data: this.ratesData, label: 'Base currency vs EUR' }];
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
    let today = new Date();
    let todayString = new Date().toISOString().slice(0, 10);
    let startDate = new Date(today.setDate(today.getDate() - 30))
    let startDateString = startDate.toISOString().substring(0, 10);

    this.currencyService.getRatesByBaseAndSymbol(startDateString, todayString, 'EUR', 'PLN').subscribe(rates => {
      console.log(rates);
      this.setChartLabels(rates);
      this.ratesData = this.getChartData(rates);
      Object.assign(this.chartData[0], { data: this.ratesData });
    });
  }

  setChartLabels(data: object) {
    let sortedObject = this.currencyService.sortObjectByKeys(data);
    Object.keys(sortedObject).forEach(k => {
      this.chartLabels.push(k);
    });
  }

  getChartData(data: object): number[] {
    let sortedObject = this.currencyService.sortObjectByKeys(data);
    let rates = [];

    Object.entries(sortedObject).forEach(([k, v]) => {
      rates.push(v);
    });

    rates = rates.map(rate => {
      return rate.PLN
    });
    return rates;
  }
}
