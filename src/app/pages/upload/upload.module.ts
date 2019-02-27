import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './upload.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Daterangepicker } from 'ng2-daterangepicker';
/* components */
import { UploadComponent } from './upload.component';
import { BookUploadComponent } from './components/book-upload/book-upload.component';
import { ChartsUploadComponent } from './components/charts-upload/charts-upload.component';
import { ContractUploadComponent } from './components/contract-upload/contract-upload.component';
import { RoyaltiesUploadComponent } from './components/royalties-upload/royalties-upload.component';


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
        UploadComponent,
        BookUploadComponent,
        ChartsUploadComponent,
        ContractUploadComponent,
        RoyaltiesUploadComponent
    ]
})
export class UploadModule { }
