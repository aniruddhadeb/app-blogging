import { Routes } from '@angular/router';

export const PHOTO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/album-list/album-list').then(m => m.AlbumList),
    title: 'Photo Albums'
  },
  {
    path: ':albumId',
    loadComponent: () => import('./pages/photo-list/photo-list').then(m => m.PhotoList),
    title: 'Album Photos'
  }
];