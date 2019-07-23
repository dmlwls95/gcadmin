import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { AuthGuard } from './auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'pages/form/book-check', canActivate: [AuthGuard],
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'pages/form/book-check', canActivate: [AuthGuard],
  }
];

export const routing = RouterModule.forRoot(appRoutes);
