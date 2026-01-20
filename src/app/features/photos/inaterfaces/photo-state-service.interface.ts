import { Signal } from '@angular/core';
import { Album } from '../../../core/models/album.model';
import { Photo } from '../../../core/models/photo.model';

export interface IPhotoStateService {
  albums: Signal<Album[]>;
  selectedAlbum: Signal<Album | null>;
  photos: Signal<Photo[]>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  loadAlbums(): void;
  loadAlbumById(id: number): void;
  loadPhotosByAlbumId(albumId: number): void;
  reset(): void;
}