import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule
} from '@angular/material';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    imports: [],
    exports: [
        MatButtonModule,
        MatMenuModule,
        MatToolbarModule,
        MatIconModule,
        MatCardModule,
        MatTableModule,
        MatSelectModule,
        BrowserModule,
        MatToolbarModule,
        MatTabsModule,
        BrowserAnimationsModule,
    ]
})
export class MaterialModule { }