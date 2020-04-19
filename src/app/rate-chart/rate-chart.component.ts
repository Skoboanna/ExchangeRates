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
  changeDetection: ChangeDetectionStrategy.OnPush
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

  ngOnInit() {

    console.log("CHART INIT");
    console.log("baseS: " + this.baseSymbol, "symbol: " + this.symbol);

    this.chartLabels = [];
    this.baseCurrencyRates = [];
    this.chartData = [{ data: this.baseCurrencyRates, label: 'Base currency vs EUR' }];
    this.startDate = getDateFromToday(30);
    this.endDate = getDateFromToday(0);
    this.getRatesByBaseCurrency(this.symbol, this.baseSymbol);
    this.baseCurrencyChangeSubscriber = this.currencyService.onBaseCurrencyChanged.subscribe(symbol => {
      this.baseSymbol = symbol;
      this.getRatesByBaseCurrency(this.symbol, this.baseSymbol);
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

  getRatesByBaseCurrency(currencySymbol, baseSymbol) {
    this.loaderService.startLoading();
    console.log(currencySymbol, baseSymbol);
    if (currencySymbol === baseSymbol) {
      this.chartLabels.length = 0;
      Object.assign(this.chartData[0], { data: [] });
      console.log("bierej inno walute");
      this.loaderService.stopLoading();
      return;
    }
    this.currencyService.getRatesByBaseAndSymbol(this.startDate, this.endDate, currencySymbol, baseSymbol).subscribe(rates => {
      console.log(rates);
      this.chartLabels.length = 0;
      this.chartLabels = this.getChartLabels(rates, this.chartLabels);
      this.baseCurrencyRates = this.getChartData(rates);
      Object.assign(this.chartData[0], { data: this.baseCurrencyRates });
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
    console.log("CHART DESTROYED");
    this.baseCurrencyChangeSubscriber.unsubscribe();
    // this.chart.chart.destroy();
  }
}
