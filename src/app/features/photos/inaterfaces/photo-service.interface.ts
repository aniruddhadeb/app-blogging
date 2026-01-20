import { Observable } from 'rxjs';
import { Album } from '../../../core/models/album.model';
import { Photo } from '../../../core/models/photo.model';

export interface IPhotoService {
  getAlbums(): Observable<Album[]>;
  getAlbumById(id: number): Observable<Album>;
  getPhotosByAlbumId(albumId: number): Observable<Photo[]>;
  getAllPhotos(): Observable<Photo[]>;
}