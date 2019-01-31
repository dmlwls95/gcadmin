import { Routes, RouterModule } from '@angular/router';
import { MenuLevelsComponent } from './menu-levels.component';
import { Levels2Component } from './components/levels-2/levels-2.component';
import { PayUploadComponent } from './components/pay-upload/pay-upload.component';
import { PayCheckComponent } from './components/pay-check/pay-check.component';
const childRoutes: Routes = [
    {
        path: '',
        component: MenuLevelsComponent,
        children: [
            { path: '', redirectTo: 'levels1', pathMatch: 'full' },
            { path: 'levels1', loadChildren: './components/levels-1/levels-1.module#Levels1Module' },
            { path: 'levels2', component: Levels2Component },
            { path: 'pay-upload', component: PayUploadComponent},
            { path: 'pay-check', component: PayCheckComponent}
        ]
    }
];

export const routing = RouterModule.forChild(childRoutes);