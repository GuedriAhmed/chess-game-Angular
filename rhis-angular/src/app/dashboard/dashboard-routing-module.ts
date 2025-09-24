import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from '../core/auth-guard';

export const dashboardRoutes: Routes = [
  { path: '', component: Dashboard, canActivate: [authGuard] }
];
