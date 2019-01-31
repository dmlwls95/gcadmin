import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { AuthGuard } from './auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'pages/index', canActivate: [AuthGuard],
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'pages/index', canActivate: [AuthGuard],
  }
];

export const routing = RouterModule.forRoot(appRoutes);
