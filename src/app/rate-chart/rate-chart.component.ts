import { Component, OnInit, ViewChild, Input, SimpleChanges } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { CurrencyService } from '../services/currency.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { getOrderedListOfObjects, getDateFromToday, getOrderedObjectKeys } from '../utilities/utils';
import { BaseChartDirective } from 'ng2-charts';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'rate-chart',
  templateUrl: './rate-chart.component.html',
  styleUrls: ['./rate-chart.component.scss'],
})
export class RateChartComponent implements OnInit {
  public chartLabels: Label[];
  public baseCurrencyRates: any[];
  public chartData: ChartDataSets[];
  private startDate: string;
  private endDate: string;

  constructor(private currencyService: CurrencyService, private loaderService: LoaderService) { }

  @ViewChild(BaseChartDirective, { static: true })
  chart: BaseChartDirective;
  baseCurrencyChangeSubscriber: any;

  @Input() symbol: string;
  @Input() baseSymbol: string;
  @Input() chartLegend: boolean;

  ngOnInit() {
    this.chartLabels = [];
    this.baseCurrencyRates = [];
    this.chartData = [{ data: this.baseCurrencyRates, label: `${this.baseSymbol} vs ${this.symbol}` }];
    this.startDate = getDateFromToday(30);
    this.endDate = getDateFromToday(0);
    this.getRatesByBaseCurrency(this.baseSymbol, this.symbol);
    this.baseCurrencyChangeSubscriber = this.currencyService.onBaseCurrencyChanged.subscribe(symbol => {
      this.baseSymbol = symbol;
      this.getRatesByBaseCurrency(this.baseSymbol, this.symbol);
    });
  }

  chartOptions = {
    responsive: true,
  };

  chartColors: Color[] = [{
    borderColor: 'blue'
  }];

  chartType = 'line';

  updateChart() {
    this.chart.chart.update();
  }

  getRatesByBaseCurrency(currencySymbol, baseSymbol) {
    this.loaderService.startLoading();
    if (currencySymbol === baseSymbol) {
      this.chartLabels.length = 0;
      Object.assign(this.chartData[0], { data: [], label: `Please change the value of base currency` });
      this.loaderService.stopLoading();
      return;
    }
    console.log(currencySymbol + " " + baseSymbol);
    this.currencyService.getRatesByBaseAndSymbol(this.startDate, this.endDate, currencySymbol, baseSymbol).subscribe(rates => {
      this.chartLabels.length = 0;
      this.chartLabels = this.getChartLabels(rates, this.chartLabels);
      this.baseCurrencyRates = this.getChartData(rates);
      Object.assign(this.chartData[0], { data: this.baseCurrencyRates, label: `${this.baseSymbol} vs ${this.symbol}` });
      this.updateChart();
    });
  }

  getChartLabels(rates: object, labels: Label[]) {
    let sortedLabels = getOrderedObjectKeys(rates);
    sortedLabels.forEach(label => labels.push(label));
    return sortedLabels;
  }

  getChartData(ratesObject: object) {
    let sortedRates = getOrderedListOfObjects(ratesObject);
    let currencySymbol;
    currencySymbol = Object.keys(sortedRates[0])[0];
    sortedRates = sortedRates.map(rate => {
      return rate[currencySymbol];
    });
    return sortedRates;
  }

  ngOnDestroy() {
    this.baseCurrencyChangeSubscriber.unsubscribe();
  }
}
