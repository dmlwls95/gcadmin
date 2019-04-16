import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './form.routing';
import { SharedModule } from '../../shared/shared.module';
import { FileUploadModule } from 'ng2-file-upload';
import { SelectModule } from 'ng2-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Ng2CompleterModule } from "ng2-completer";

/* components */
import { FormComponent } from './form.component';
import { FormInputsComponent } from './components/form-inputs/form-inputs.component';
import { FormLayoutsComponent } from './components/form-layouts/form-layouts.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { Ng2SelectComponent } from './components/ng2-select/ng2-select.component';
import { SingleSelectComponent } from './components/ng2-select/single-select/single-select.component';
import { MultipleSelectComponent } from './components/ng2-select/multiple-select/multiple-select.component';
import { ChildrenSelectComponent } from './components/ng2-select/children-select/children-select.component';
import { BookCheckComponent } from './components/book-check/book-check.component';
import { BookOnlyCheckComponent } from './components/book-only-check/book-only-check.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FileUploadModule,
        SelectModule,
        routing,
        FormsModule, 
        ReactiveFormsModule,
        Ng2SmartTableModule,
        Ng2CompleterModule
    ],
    declarations: [
        FormComponent,
        FormInputsComponent,
        FormLayoutsComponent,
        FileUploadComponent,
        Ng2SelectComponent,
        SingleSelectComponent,
        MultipleSelectComponent,
        ChildrenSelectComponent,
        BookCheckComponent,
        BookOnlyCheckComponent
    ]
})
export class FormModule { }
