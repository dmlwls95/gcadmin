import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './table.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Daterangepicker } from 'ng2-daterangepicker';
/* components */
import { TableComponent } from './table.component';
import { BasicTablesComponent } from './components/basic-tables/basic-tables.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { RoyaltiesCheckComponent } from './components/royalties-check/royalties-check.component';
import { RoyaltiePayedComponent } from './components/royaltie-payed/royaltie-payed.component';
import { RoyaltiesPeriodComponent } from './components/royalties-period/royalties-period.component';


@NgModule({
    imports: [
        NgxPaginationModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        routing,
        Ng2SmartTableModule,
        Daterangepicker
    ],
    declarations: [
        TableComponent,
        BasicTablesComponent,
        DataTableComponent,
        RoyaltiesCheckComponent,
        RoyaltiePayedComponent,
        RoyaltiesPeriodComponent
    ]
})
export class TableModule { }
