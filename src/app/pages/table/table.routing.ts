import { Routes, RouterModule } from '@angular/router';
import { TableComponent } from './table.component';
import { BasicTablesComponent } from './components/basic-tables/basic-tables.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { RoyaltiesCheckComponent } from './components/royalties-check/royalties-check.component';
import { RoyaltiePayedComponent } from './components/royaltie-payed/royaltie-payed.component';
import { RoyaltiesPayingComponent } from './components/royalties-paying/royalties-paying.component';
const childRoutes: Routes = [
    {
        path: '',
        component: TableComponent,
        children: [
            { path: '', redirectTo: 'default-tables', pathMatch: 'full' },
            { path: 'basic-tables', component: BasicTablesComponent },
            { path: 'data-table', component: DataTableComponent },
            { path: 'royalties-check', component: RoyaltiesCheckComponent},
            { path: 'royalties-paying', component: RoyaltiesPayingComponent},
            { path: 'royaltie-payed', component: RoyaltiePayedComponent},
        ]
    }
];

export const routing = RouterModule.forChild(childRoutes);
