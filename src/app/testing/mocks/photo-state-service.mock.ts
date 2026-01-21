import { signal } from '@angular/core';
import { Album } from '../../core/models/album.model';
import { Photo } from '../../core/models/photo.model';
import { TEST_ALBUMS, TEST_PHOTOS } from '../test-data/test-data';
import { IPhotoStateService } from '../../features/photos/inaterfaces/photo-state-service.interface';

export class MockPhotoStateService implements IPhotoStateService {
  private _albums = signal<Album[]>([]);
  private _selectedAlbum = signal<Album | null>(null);
  private _photos = signal<Photo[]>([]);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  albums = this._albums.asReadonly();
  selectedAlbum = this._selectedAlbum.asReadonly();
  photos = this._photos.asReadonly();
  isLoading = this._isLoading.asReadonly();
  error = this._error.asReadonly();

  loadAlbums(): void {
    this._isLoading.set(true);
    this._albums.set(TEST_ALBUMS);
    this._isLoading.set(false);
  }

  loadAlbumById(id: number): void {
    this._isLoading.set(true);
    setTimeout(() => {
      const album = TEST_ALBUMS.find((a) => a.id === id);
      this._selectedAlbum.set(album || null);
      this._isLoading.set(false);
    }, 0);
  }

  loadPhotosByAlbumId(albumId: number): void {
    this._isLoading.set(true);
    setTimeout(() => {
      const albumPhotos = TEST_PHOTOS.filter((p) => p.albumId === albumId);
      this._photos.set(albumPhotos);
      this._isLoading.set(false);
    }, 0);
  }

  reset(): void {
    this._albums.set([]);
    this._selectedAlbum.set(null);
    this._photos.set([]);
    this._isLoading.set(false);
    this._error.set(null);
  }

  // Helper methods for testing
  setAlbums(albums: Album[]): void {
    this._albums.set(albums);
  }

  setAlbum(album: Album | null): void {
    this._selectedAlbum.set(album);
  }

  setPhotos(photos: Photo[]): void {
    this._photos.set(photos);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }
}
