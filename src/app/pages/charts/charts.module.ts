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
import { ChartsUploadComponent } from './components/charts-upload/charts-upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContractUploadComponent } from './components/contract-upload/contract-upload.component';

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
        ChartsUploadComponent,
        ContractUploadComponent,
    ]
})
export class ChartsModule { }
