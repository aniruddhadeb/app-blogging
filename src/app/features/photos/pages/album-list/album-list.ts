import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PHOTO_STATE_SERVICE } from '../../tokens/photo.tokens';
import { Album } from '../../../../core/models/album.model';
import { IPhotoStateService } from '../../inaterfaces/photo-state-service.interface';
import { HlmSpinner } from '@shared/ui/spinner';
import { HlmCard, HlmCardContent, HlmCardHeader } from '@shared/ui/card';
import { HlmAlert, HlmAlertDescription, HlmAlertTitle } from '@shared/ui/alert';

@Component({
  selector: 'app-album-list',
  imports: [
    CommonModule,
    RouterLink,
    HlmSpinner,
    HlmCard,
    HlmAlert,
    HlmAlertDescription,
    HlmAlertTitle,
    HlmCardHeader,
    HlmCardContent,
  ],
  templateUrl: './album-list.html',
  styleUrls: ['./album-list.css'],
})
export class AlbumList implements OnInit {
  private readonly photoState: IPhotoStateService = inject(PHOTO_STATE_SERVICE);

  albums = this.photoState.albums;
  isLoading = this.photoState.isLoading;
  error = this.photoState.error;

  ngOnInit(): void {
    this.photoState.loadAlbums();
  }

  trackByAlbumId(index: number, album: Album): number {
    return album.id;
  }
}
