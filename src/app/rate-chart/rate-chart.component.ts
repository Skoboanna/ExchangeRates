import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { CurrencyService } from '../services/currency.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { sortObjectByKeys, getDateFromToday } from '../utilities/utils';
import { BaseChartDirective } from 'ng2-charts';

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
  private baseSymbol;

  constructor(private currencyService: CurrencyService) { }

  @ViewChild(BaseChartDirective, { static: false })
  public chart: BaseChartDirective;

  ngOnInit() {
    this.chartLabels = [];
    this.baseCurrencyRates = [];
    this.chartData = [{ data: this.baseCurrencyRates, label: 'Base currency vs EUR' }];
    this.startDate = getDateFromToday(30);
    this.endDate = getDateFromToday(0);
    this.currencyService.onBaseCurrencyChanged.subscribe(symbol => {
      this.baseSymbol = symbol;
      this.getRatesByBaseCurrency(this.baseSymbol);
    });
  }

  chartOptions = {
    responsive: true,
  };

  chartColors: Color[] = [{
    borderColor: 'blue'
  }];

  chartLegend = true;
  chartType = 'line';

  updateChart() {
    this.chart.chart.update();
  }

  getRatesByBaseCurrency(symbol) {
    console.log(symbol);
    this.currencyService.getRatesByBaseAndSymbol(this.startDate, this.endDate, 'EUR', symbol).subscribe(rates => {
      this.chartLabels.length = 0;
      this.chartLabels = this.getChartLabels(rates, this.chartLabels);
      this.baseCurrencyRates = this.getChartData(rates);
      Object.assign(this.chartData[0], { data: this.baseCurrencyRates });
      this.updateChart();
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
    let currencySymbol;

    Object.entries(sortedRates).forEach(([date, rateObject]) => {
      baseRates.push(rateObject);
    });
    currencySymbol = Object.keys(baseRates[0])[0];

    baseRates = baseRates.map(rate => {
      return rate[currencySymbol];
    });
    return baseRates;
  }

  ngOnDestroy() { }
}
