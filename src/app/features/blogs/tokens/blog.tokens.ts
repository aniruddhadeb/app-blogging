import { InjectionToken } from '@angular/core';
import { IBlogService } from '../interfaces/blog-service.interface';
import { IBlogStateService } from '../interfaces/blog-state-service.interface';

export const BLOG_SERVICE = new InjectionToken<IBlogService>('BLOG_SERVICE');
export const BLOG_STATE_SERVICE = new InjectionToken<IBlogStateService>('BLOG_STATE_SERVICE');