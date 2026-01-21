import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PhotoStateService } from './photo-state.service';
import { PHOTO_SERVICE } from '../tokens/photo.tokens';
import { Album } from '../../../core/models/album.model';
import { Photo } from '../../../core/models/photo.model';
import { of, throwError } from 'rxjs';

describe('PhotoStateService (Vitest)', () => {
  let service: PhotoStateService;
  let photoServiceMock: {
    getAlbums: ReturnType<typeof vi.fn>;
    getAlbumById: ReturnType<typeof vi.fn>;
    getPhotosByAlbumId: ReturnType<typeof vi.fn>;
    getAllPhotos: ReturnType<typeof vi.fn>;
  };

  const mockAlbums: Album[] = [
    { id: 1, title: 'Album 1', userId: 1 },
    { id: 2, title: 'Album 2', userId: 1 },
  ];

  const mockPhotos: Photo[] = [
    { id: 1, albumId: 1, title: 'Photo 1', url: 'url1', thumbnailUrl: 'thumb1' },
    { id: 2, albumId: 1, title: 'Photo 2', url: 'url2', thumbnailUrl: 'thumb2' },
  ];

  beforeEach(() => {
    photoServiceMock = {
      getAlbums: vi.fn(),
      getAlbumById: vi.fn(),
      getPhotosByAlbumId: vi.fn(),
      getAllPhotos: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        PhotoStateService,
        { provide: PHOTO_SERVICE, useValue: photoServiceMock },
      ],
    });

    service = TestBed.inject(PhotoStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loadAlbums() should populate albums', async () => {
    photoServiceMock.getAlbums.mockReturnValue(of(mockAlbums));

    service.loadAlbums();

    await Promise.resolve();

    expect(service.albums()).toEqual(mockAlbums);
    expect(service.isLoading()).toBe(false);
    expect(service.error()).toBeNull();
  });

  it('loadAlbums() should handle error', async () => {
    photoServiceMock.getAlbums.mockReturnValue(
      throwError(() => new Error('Network error'))
    );

    service.loadAlbums();

    await Promise.resolve();

    expect(service.albums()).toEqual([]);
    expect(service.isLoading()).toBe(false);
    expect(service.error()).toBe('Network error');
  });

  it('loadAlbumById() should set selectedAlbum', async () => {
    photoServiceMock.getAlbumById.mockReturnValue(of(mockAlbums[0]));

    service.loadAlbumById(1);

    await Promise.resolve();

    expect(service.selectedAlbum()).toEqual(mockAlbums[0]);
    expect(service.error()).toBeNull();
  });

  it('loadAlbumById() should handle error', async () => {
    photoServiceMock.getAlbumById.mockReturnValue(
      throwError(() => new Error('Album not found'))
    );

    service.loadAlbumById(999);

    await Promise.resolve();

    expect(service.selectedAlbum()).toBeNull();
    expect(service.error()).toBe('Album not found');
  });

  it('loadPhotosByAlbumId() should populate photos', async () => {
    photoServiceMock.getPhotosByAlbumId.mockReturnValue(of(mockPhotos));

    service.loadPhotosByAlbumId(1);

    await Promise.resolve();

    expect(service.photos()).toEqual(mockPhotos);
    expect(service.error()).toBeNull();
  });

  it('loadPhotosByAlbumId() should handle error', async () => {
    photoServiceMock.getPhotosByAlbumId.mockReturnValue(
      throwError(() => new Error('Failed to load photos'))
    );

    service.loadPhotosByAlbumId(1);

    await Promise.resolve();

    expect(service.photos()).toEqual([]);
    expect(service.error()).toBe('Failed to load photos');
  });

  it('reset() should clear all state', () => {
    service.reset();

    expect(service.albums()).toEqual([]);
    expect(service.selectedAlbum()).toBeNull();
    expect(service.photos()).toEqual([]);
    expect(service.isLoading()).toBe(false);
    expect(service.error()).toBeNull();
  });
});
