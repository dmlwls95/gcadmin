import { Routes, RouterModule } from '@angular/router';
import { UploadComponent } from './upload.component';
import { BookUploadComponent } from './components/book-upload/book-upload.component';
import { ChartsUploadComponent } from './components/charts-upload/charts-upload.component';
import { ContractUploadComponent } from './components/contract-upload/contract-upload.component';
import { RoyaltiesUploadComponent } from './components/royalties-upload/royalties-upload.component';

const childRoutes: Routes = [
    {
        path: '',
        component: UploadComponent,
        children: [
            { path: '', redirectTo: 'charts-upload', pathMatch: 'full' },
            { path: 'book-upload', component: BookUploadComponent },
            { path: 'charts-upload', component: ChartsUploadComponent },
            { path: 'contract-upload', component: ContractUploadComponent},
            { path: 'royalties-upload', component: RoyaltiesUploadComponent}
        ]
    }
];

export const routing = RouterModule.forChild(childRoutes);
