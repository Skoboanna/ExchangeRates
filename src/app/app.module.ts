import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CurrencyTableComponent } from './currency-table/currency-table.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { RateChartComponent } from './rate-chart/rate-chart.component';

import { CurrencyService } from './services/currency.service';
import { BaseCurrencySelectComponent } from './base-currency-select/base-currency-select.component';


@NgModule({
  declarations: [
    AppComponent,
    CurrencyTableComponent,
    RateChartComponent,
    BaseCurrencySelectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ChartsModule
  ],
  providers: [
    CurrencyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
