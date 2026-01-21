import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/blogs',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'blogs',
    loadChildren: () => import('./features/blogs/blogs.routes').then(m => m.BLOG_ROUTES)
  },
  {
    path: 'photos',
    loadChildren: () => import('./features/photos/photos.routes').then(m => m.PHOTO_ROUTES)
  },
  {
    path: '**',
    redirectTo: '/blogs'
  }
];
