import { InjectionToken } from '@angular/core';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => 'https://jsonplaceholder.typicode.com'
});

export const POSTS_API_URL = new InjectionToken<string>('POSTS_API_URL', {
  providedIn: 'root',
  factory: () => '/posts'
});

export const COMMENTS_API_URL = new InjectionToken<string>('COMMENTS_API_URL', {
  providedIn: 'root',
  factory: () => '/comments'
});

export const ALBUMS_API_URL = new InjectionToken<string>('ALBUMS_API_URL', {
  providedIn: 'root',
  factory: () => '/albums'
});

export const PHOTOS_API_URL = new InjectionToken<string>('PHOTOS_API_URL', {
  providedIn: 'root',
  factory: () => '/photos'
});