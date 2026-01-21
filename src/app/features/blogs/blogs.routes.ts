import { Routes } from "@angular/router";
import { authGuard } from "../../core/guards/auth.guard";

export const BLOG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/blog-list/blog-list').then(m => m.BlogList),
    title: 'Blog Posts'
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/blog-detail/blog-detail').then(m => m.BlogDetail),
    title: 'Post Detail'
  },
  {
    path: ':id/add-comment',
    loadComponent: () => import('./pages/add-comment/add-comment').then(m => m.AddComment),
    canActivate: [authGuard],
    title: 'Add Comment'
  }
];