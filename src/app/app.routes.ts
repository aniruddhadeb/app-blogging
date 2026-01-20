import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'blogs',
    loadChildren: () =>
      import('./features/blogs/blogs.routes').then(m => m.BLOG_ROUTES)
  },
  { path: '', redirectTo: 'blogs', pathMatch: 'full' }
];
