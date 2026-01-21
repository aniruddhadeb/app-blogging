import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPhotoStateService } from '../../inaterfaces/photo-state-service.interface';
import { PHOTO_STATE_SERVICE } from '../../tokens/photo.tokens';
import { Photo } from '../../../../core/models/photo.model';
import { CommonModule } from '@angular/common';
import { HlmAlert, HlmAlertDescription, HlmAlertTitle } from '@shared/ui/alert';
import { HlmCard, HlmCardContent, HlmCardHeader } from '@shared/ui/card';
import { HlmButton } from '@shared/ui/button';
import { HlmSpinner } from '@shared/ui/spinner';
import { Pagination } from '../../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-photo-list',
  imports: [
    CommonModule,
    HlmAlert,
    HlmCard,
    HlmAlert,
    HlmAlertDescription,
    HlmButton,
    HlmSpinner,
    HlmAlertTitle,
    HlmCardHeader,
    HlmCardContent,
    Pagination,
  ],
  templateUrl: './photo-list.html',
  styleUrl: './photo-list.css',
})
export class PhotoList {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly photoState: IPhotoStateService = inject(PHOTO_STATE_SERVICE);

  photos = this.photoState.photos;
  album = this.photoState.selectedAlbum;
  isLoading = this.photoState.isLoading;
  error = this.photoState.error;

  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(12);

  paginatedPhotos = computed(() => {
    const allPhotos = this.photos();
    const page = this.currentPage();
    const perPage = this.itemsPerPage();
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    return allPhotos.slice(startIndex, endIndex);
  });

  totalPhotos = computed(() => this.photos().length);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const albumId = Number(params['albumId']);
      if (albumId) {
        this.photoState.loadAlbumById(albumId);
        this.photoState.loadPhotosByAlbumId(albumId);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack(): void {
    this.router.navigate(['/photos']);
  }

  trackByPhotoId(index: number, photo: Photo): number {
    return photo.id;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/150/cccccc/666666?text=No+Image';
  }

  onPageChangeEvent(event: unknown): void {
    this.onPageChange(event as number);
  }
}
