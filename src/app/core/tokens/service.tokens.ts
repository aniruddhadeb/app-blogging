import { InjectionToken } from '@angular/core';
import { IAuthService } from '../interfaces/auth-service.interface';
import { IStorageService } from '../interfaces/storage-service.interface';
import { IThemeService } from '../interfaces/theme-service.interface';

export const AUTH_SERVICE = new InjectionToken<IAuthService>('AUTH_SERVICE');
export const STORAGE_SERVICE = new InjectionToken<IStorageService>('STORAGE_SERVICE');
export const THEME_SERVICE = new InjectionToken<IThemeService>('THEME_SERVICE');