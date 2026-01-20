import { computed, inject, Injectable, signal } from '@angular/core';
import { Album } from '../../../core/models/album.model';
import { Photo } from '../../../core/models/photo.model';
import { catchError, of, tap } from 'rxjs';
import { PHOTO_SERVICE } from '../tokens/photo.tokens';

interface PhotoState {
  albums: Album[];
  selectedAlbum: Album | null;
  photos: Photo[];
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoStateService {
  private readonly photoService = inject(PHOTO_SERVICE);

  // Private state signal
  private readonly state = signal<PhotoState>({
    albums: [],
    selectedAlbum: null,
    photos: [],
    isLoading: false,
    error: null
  });

  // Public readonly signals
  readonly albums = computed(() => this.state().albums);
  readonly selectedAlbum = computed(() => this.state().selectedAlbum);
  readonly photos = computed(() => this.state().photos);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly error = computed(() => this.state().error);

  // Update state helper
  private updateState(partial: Partial<PhotoState>): void {
    this.state.update(current => ({ ...current, ...partial }));
  }

  // Load all albums
  loadAlbums(): void {
    this.updateState({ isLoading: true, error: null });

    this.photoService.getAlbums()
      .pipe(
        tap(albums => this.updateState({ albums, isLoading: false })),
        catchError(error => {
          this.updateState({ 
            error: error.message || 'Failed to load albums', 
            isLoading: false 
          });
          return of([]);
        })
      )
      .subscribe();
  }

  // Load album by ID
  loadAlbumById(id: number): void {
    this.updateState({ isLoading: true, error: null });

    this.photoService.getAlbumById(id)
      .pipe(
        tap(album => this.updateState({ selectedAlbum: album, isLoading: false })),
        catchError(error => {
          this.updateState({ 
            error: error.message || 'Failed to load album', 
            isLoading: false 
          });
          return of(null);
        })
      )
      .subscribe();
  }

  // Load photos for an album
  loadPhotosByAlbumId(albumId: number): void {
    this.updateState({ isLoading: true, error: null });

    this.photoService.getPhotosByAlbumId(albumId)
      .pipe(
        tap(photos => this.updateState({ photos, isLoading: false })),
        catchError(error => {
          this.updateState({ 
            error: error.message || 'Failed to load photos', 
            isLoading: false 
          });
          return of([]);
        })
      )
      .subscribe();
  }

  // Reset state
  reset(): void {
    this.state.set({
      albums: [],
      selectedAlbum: null,
      photos: [],
      isLoading: false,
      error: null
    });
  }
}
