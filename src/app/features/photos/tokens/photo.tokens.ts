import { InjectionToken } from '@angular/core';
import { IPhotoService } from '../inaterfaces/photo-service.interface';
import { IPhotoStateService } from '../inaterfaces/photo-state-service.interface';

export const PHOTO_SERVICE = new InjectionToken<IPhotoService>('PHOTO_SERVICE');
export const PHOTO_STATE_SERVICE = new InjectionToken<IPhotoStateService>('PHOTO_STATE_SERVICE');