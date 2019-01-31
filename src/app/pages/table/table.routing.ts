import { Routes, RouterModule } from '@angular/router';
import { TableComponent } from './table.component';
import { BasicTablesComponent } from './components/basic-tables/basic-tables.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { RoyaltiesCheckComponent } from './components/royalties-check/royalties-check.component';
import { RoyaltiesUploadComponent } from './components/royalties-upload/royalties-upload.component';

const childRoutes: Routes = [
    {
        path: '',
        component: TableComponent,
        children: [
            { path: '', redirectTo: 'default-tables', pathMatch: 'full' },
            { path: 'basic-tables', component: BasicTablesComponent },
            { path: 'data-table', component: DataTableComponent },
            { path: 'royalties-check', component: RoyaltiesCheckComponent},
            { path: 'royalties-upload', component: RoyaltiesUploadComponent}
        ]
    }
];

export const routing = RouterModule.forChild(childRoutes);
