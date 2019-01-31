import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './menu-levels.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

/* components */
import { MenuLevelsComponent } from './menu-levels.component';
import { Levels2Component } from './components/levels-2/levels-2.component';
import { PayUploadComponent } from './components/pay-upload/pay-upload.component';
import { PayCheckComponent } from './components/pay-check/pay-check.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        routing,
        Ng2SmartTableModule
    ],
    declarations: [
        MenuLevelsComponent,
        Levels2Component,
        PayUploadComponent,
        PayCheckComponent
    ]
})
export class MenuLevelsModule { }
