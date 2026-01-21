import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
    title: 'Login - Blog App'
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup').then(m => m.Signup),
    title: 'Sign Up - Blog App'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
