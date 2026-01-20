import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ALBUMS_API_URL, API_BASE_URL, PHOTOS_API_URL } from '../../../shared/tokens/api.tokens';
import { Observable } from 'rxjs';
import { Album } from '../../../core/models/album.model';
import { Photo } from '../../../core/models/photo.model';
import { IPhotoService } from '../inaterfaces/photo-service.interface';

@Injectable({
  providedIn: 'root'
})
export class PhotoService implements IPhotoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly albumsUrl = inject(ALBUMS_API_URL);
  private readonly photosUrl = inject(PHOTOS_API_URL);

  getAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.baseUrl}${this.albumsUrl}`);
  }

  getAlbumById(id: number): Observable<Album> {
    return this.http.get<Album>(`${this.baseUrl}${this.albumsUrl}/${id}`);
  }

  getPhotosByAlbumId(albumId: number): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.baseUrl}${this.albumsUrl}/${albumId}${this.photosUrl}`);
  }

  getAllPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.baseUrl}${this.photosUrl}`);
  }
}
