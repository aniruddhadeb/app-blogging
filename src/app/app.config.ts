import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { AUTH_SERVICE, STORAGE_SERVICE } from './core/tokens/service.tokens';
import { AuthService } from './core/services/auth.service';
import { StorageService } from './core/services/storage.service';
import { PHOTO_SERVICE, PHOTO_STATE_SERVICE } from './features/photos/tokens/photo.tokens';
import { PhotoService } from './features/photos/services/photo.service';
import { PhotoStateService } from './features/photos/services/photo-state.service';
import { BLOG_SERVICE, BLOG_STATE_SERVICE } from './features/blogs/tokens/blog.tokens';
import { BlogService } from './features/blogs/services/blog.service';
import { BlogStateService } from './features/blogs/services/blog-state.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor])),
        // Core service providers
        { provide: AUTH_SERVICE, useClass: AuthService },
        { provide: STORAGE_SERVICE, useClass: StorageService },
        // { provide: THEME_SERVICE, useClass: ThemeService },
        
        // Blog service providers
        { provide: BLOG_SERVICE, useClass: BlogService },
        { provide: BLOG_STATE_SERVICE, useClass: BlogStateService },

       // Photo service providers
        { provide: PHOTO_SERVICE, useClass: PhotoService },
        { provide: PHOTO_STATE_SERVICE, useClass: PhotoStateService }
  ],
};
