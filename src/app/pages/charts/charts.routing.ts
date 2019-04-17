import { Routes, RouterModule } from '@angular/router';
import { ChartsComponent } from './charts.component';
import { EChartsComponent } from './components/echarts/echarts.component';
import { ChartsCheckComponent } from './components/charts-check/charts-check.component';
import { ChartOnlyCheckComponent } from './components/chart-only-check/chart-only-check.component';

const childRoutes: Routes = [
    {
        path: '',
        component: ChartsComponent,
        children: [
            { path: '', redirectTo: 'echarts', pathMatch: 'full' },
            { path: 'echarts', component: EChartsComponent },
            { path: 'charts-check', component: ChartsCheckComponent },
            { path: 'chart-only-check', component: ChartOnlyCheckComponent}
        ]
    }
];

export const routing = RouterModule.forChild(childRoutes);