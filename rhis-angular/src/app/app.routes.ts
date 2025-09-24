import { Routes } from '@angular/router';
import { Home } from './home/home/home';
import { Board } from './board/board';  

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-routing-module').then(m => m.authRoutes)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard-routing-module').then(m => m.dashboardRoutes)

  },
  { path: 'board', loadComponent: () => import('./board/board').then(m => m.Board) },
  { path: '**', redirectTo: '' }
];
