import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { routing } from './charts.routing';
import { NgxEchartsModule } from 'ngx-echarts';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxPaginationModule } from 'ngx-pagination';

/* components */
import { ChartsComponent } from './charts.component';
import { EChartsComponent } from './components/echarts/echarts.component';
import { ChartsCheckComponent } from './components/charts-check/charts-check.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartOnlyCheckComponent } from './components/chart-only-check/chart-only-check.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgxEchartsModule,
        routing,
        Ng2SmartTableModule,
        FormsModule, 
        ReactiveFormsModule,
        NgxPaginationModule
    ],
    declarations: [
        ChartsComponent,
        EChartsComponent,
        ChartsCheckComponent,
        ChartOnlyCheckComponent
    ]
})
export class ChartsModule { }
