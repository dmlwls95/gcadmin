import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './form.component';
import { FormInputsComponent } from './components/form-inputs/form-inputs.component';
import { FormLayoutsComponent } from './components/form-layouts/form-layouts.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { Ng2SelectComponent } from './components/ng2-select/ng2-select.component';
import { BookUploadComponent } from './components/book-upload/book-upload.component';
import { BookCheckComponent } from './components/book-check/book-check.component';

const childRoutes: Routes = [
    {
        path: '',
        component: FormComponent,
        children: [
            { path: '', redirectTo: 'inputs', pathMatch: 'full' },
            { path: 'form-inputs', component: FormInputsComponent },
            { path: 'form-layouts', component: FormLayoutsComponent },
            { path: 'file-upload', component: FileUploadComponent },
            { path: 'ng2-select', component: Ng2SelectComponent },
            { path: 'book-upload', component: BookUploadComponent },
            { path: 'book-check', component: BookCheckComponent}
        ]
    }
];

export const routing = RouterModule.forChild(childRoutes);
