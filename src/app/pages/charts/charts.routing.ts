import { Routes, RouterModule } from '@angular/router';
import { ChartsComponent } from './charts.component';
import { EChartsComponent } from './components/echarts/echarts.component';
import { ChartsCheckComponent } from './components/charts-check/charts-check.component';
import { ChartsUploadComponent } from './components/charts-upload/charts-upload.component';
import { ContractUploadComponent } from './components/contract-upload/contract-upload.component';

const childRoutes: Routes = [
    {
        path: '',
        component: ChartsComponent,
        children: [
            { path: '', redirectTo: 'echarts', pathMatch: 'full' },
            { path: 'echarts', component: EChartsComponent },
            { path: 'charts-check', component: ChartsCheckComponent },
            { path: 'charts-upload', component: ChartsUploadComponent },
            { path: 'contract-upload', component : ContractUploadComponent}
        ]
    }
];

export const routing = RouterModule.forChild(childRoutes);