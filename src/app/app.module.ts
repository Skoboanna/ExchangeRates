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
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './services/loader.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from './loader.interceptor';
import { RatePopupComponent } from './rate-popup/rate-popup.component';
import { RateChartViewComponent } from './rate-chart-view/rate-chart-view.component';
import { RateDifferenceTableComponent } from './rate-difference-table/rate-difference-table.component';


@NgModule({
  declarations: [
    AppComponent,
    CurrencyTableComponent,
    RateChartComponent,
    BaseCurrencySelectComponent,
    LoaderComponent,
    RatePopupComponent,
    RateChartViewComponent,
    RateDifferenceTableComponent
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
    CurrencyService,
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [RatePopupComponent]
})
export class AppModule { }
