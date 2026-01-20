import { TestBed } from '@angular/core/testing';

import { PhotoStateService } from './photo-state.service';
import { IPhotoService } from '../inaterfaces/photo-service.interface';
import { Album } from '../../../core/models/album.model';
import { Photo } from '../../../core/models/photo.model';
import { PHOTO_SERVICE } from '../tokens/photo.tokens';
import { of, throwError } from 'rxjs';

describe('PhotoStateService (with PHOTO_SERVICE token)', () => {
  let service: PhotoStateService;
  let photoServiceMock: jasmine.SpyObj<IPhotoService>;

  const mockAlbums: Album[] = [
    {
      id: 1, title: 'Album 1',
      userId: 0
    },
    {
      id: 2, title: 'Album 2',
      userId: 0
    }
  ];

  const mockPhotos: Photo[] = [
    { id: 1, albumId: 1, title: 'Photo 1', url: 'url1', thumbnailUrl: 'thumb1' },
    { id: 2, albumId: 1, title: 'Photo 2', url: 'url2', thumbnailUrl: 'thumb2' }
  ];

  beforeEach(() => {
    // Create a type-safe mock of the interface
    photoServiceMock = jasmine.createSpyObj<IPhotoService>('IPhotoService', [
      'getAlbums',
      'getAlbumById',
      'getPhotosByAlbumId',
      'getAllPhotos'
    ]);

    TestBed.configureTestingModule({
      providers: [
        PhotoStateService,
        { provide: PHOTO_SERVICE, useValue: photoServiceMock } // Provide via token
      ]
    });

    service = TestBed.inject(PhotoStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loadAlbums() should update albums and isLoading', (done) => {
    photoServiceMock.getAlbums.and.returnValue(of(mockAlbums));

    service.loadAlbums();

    setTimeout(() => {
      expect(service.albums()).toEqual(mockAlbums);
      expect(service.isLoading()).toBeFalse();
      expect(service.error()).toBeNull();
      done();
    }, 0);
  });

  it('loadAlbums() should handle error', (done) => {
    const error = new Error('Network error');
    photoServiceMock.getAlbums.and.returnValue(throwError(() => error));

    service.loadAlbums();

    setTimeout(() => {
      expect(service.albums()).toEqual([]);
      expect(service.isLoading()).toBeFalse();
      expect(service.error()).toBe('Network error');
      done();
    }, 0);
  });

  it('loadAlbumById() should update selectedAlbum', (done) => {
    const album = mockAlbums[0];
    photoServiceMock.getAlbumById.and.returnValue(of(album));

    service.loadAlbumById(1);

    setTimeout(() => {
      expect(service.selectedAlbum()).toEqual(album);
      expect(service.isLoading()).toBeFalse();
      expect(service.error()).toBeNull();
      done();
    }, 0);
  });

  it('loadAlbumById() should handle error', (done) => {
    const error = new Error('Album not found');
    photoServiceMock.getAlbumById.and.returnValue(throwError(() => error));

    service.loadAlbumById(999);

    setTimeout(() => {
      expect(service.selectedAlbum()).toBeNull();
      expect(service.isLoading()).toBeFalse();
      expect(service.error()).toBe('Album not found');
      done();
    }, 0);
  });

  it('loadPhotosByAlbumId() should update photos', (done) => {
    photoServiceMock.getPhotosByAlbumId.and.returnValue(of(mockPhotos));

    service.loadPhotosByAlbumId(1);

    setTimeout(() => {
      expect(service.photos()).toEqual(mockPhotos);
      expect(service.isLoading()).toBeFalse();
      expect(service.error()).toBeNull();
      done();
    }, 0);
  });

  it('loadPhotosByAlbumId() should handle error', (done) => {
    const error = new Error('Failed to load photos');
    photoServiceMock.getPhotosByAlbumId.and.returnValue(throwError(() => error));

    service.loadPhotosByAlbumId(1);

    setTimeout(() => {
      expect(service.photos()).toEqual([]);
      expect(service.isLoading()).toBeFalse();
      expect(service.error()).toBe('Failed to load photos');
      done();
    }, 0);
  });

  it('reset() should clear the state', () => {
    // Set dummy state first
    service.loadAlbums();
    service.reset();

    expect(service.albums()).toEqual([]);
    expect(service.selectedAlbum()).toBeNull();
    expect(service.photos()).toEqual([]);
    expect(service.isLoading()).toBeFalse();
    expect(service.error()).toBeNull();
  });
});
