import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { PhotoService } from './photo.service';
import { Album } from '../../../core/models/album.model';
import { Photo } from '../../../core/models/photo.model';
import {
  API_BASE_URL,
  ALBUMS_API_URL,
  PHOTOS_API_URL,
} from '../../../shared/tokens/api.tokens';

describe('PhotoService (Vitest + provideHttpClientTesting)', () => {
  let service: PhotoService;
  let httpMock: HttpTestingController;

  const mockBaseUrl = 'http://mockapi.com/';
  const mockAlbumsUrl = 'albums';
  const mockPhotosUrl = 'photos';

  const mockAlbums: Album[] = [
    { id: 1, title: 'Album 1', userId: 0 },
    { id: 2, title: 'Album 2', userId: 0 },
  ];

  const mockPhotos: Photo[] = [
    {
      id: 1,
      albumId: 1,
      title: 'Photo 1',
      url: 'url1',
      thumbnailUrl: 'thumb1',
    },
    {
      id: 2,
      albumId: 1,
      title: 'Photo 2',
      url: 'url2',
      thumbnailUrl: 'thumb2',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PhotoService,
        { provide: API_BASE_URL, useValue: mockBaseUrl },
        { provide: ALBUMS_API_URL, useValue: mockAlbumsUrl },
        { provide: PHOTOS_API_URL, useValue: mockPhotosUrl },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(PhotoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAlbums() should return albums', () => {
    service.getAlbums().subscribe((albums) => {
      expect(albums).toEqual(mockAlbums);
    });

    const req = httpMock.expectOne(`${mockBaseUrl}${mockAlbumsUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAlbums);
  });

  it('getAlbumById() should return album by ID', () => {
    service.getAlbumById(1).subscribe((album) => {
      expect(album).toEqual(mockAlbums[0]);
    });

    const req = httpMock.expectOne(`${mockBaseUrl}${mockAlbumsUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAlbums[0]);
  });

  it('getPhotosByAlbumId() should return photos', () => {
    service.getPhotosByAlbumId(1).subscribe((photos) => {
      expect(photos).toEqual(mockPhotos);
    });

    const req = httpMock.expectOne(
      `${mockBaseUrl}${mockAlbumsUrl}/1${mockPhotosUrl}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPhotos);
  });

  it('getAllPhotos() should return all photos', () => {
    service.getAllPhotos().subscribe((photos) => {
      expect(photos).toEqual(mockPhotos);
    });

    const req = httpMock.expectOne(`${mockBaseUrl}${mockPhotosUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPhotos);
  });

  it('should propagate HTTP error in getAlbums()', () => {
    service.getAlbums().subscribe({
      next: () => {
        throw new Error('Expected request to fail');
      },
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      },
    });

    const req = httpMock.expectOne(`${mockBaseUrl}${mockAlbumsUrl}`);
    req.flush('Error', {
      status: 500,
      statusText: 'Server Error',
    });
  });
});
