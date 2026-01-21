import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { PhotoList } from './photo-list';
import { PHOTO_STATE_SERVICE } from '../../tokens/photo.tokens';
import { MockPhotoStateService } from '../../../../testing/mocks/photo-state-service.mock';
import { Photo } from '../../../../core/models/photo.model';
import { Album } from '../../../../core/models/album.model';

describe('PhotoList', () => {
  let fixture: ComponentFixture<PhotoList>;
  let component: PhotoList;
  let photoState: MockPhotoStateService;
  let router: { navigate: ReturnType<typeof vi.fn> };
  let routeParams$: Subject<any>;

  const TEST_ALBUM: Album = {
    id: 1,
    title: 'Test Album',
    userId: 1,
  };

  const TEST_PHOTOS: Photo[] = [
    { id: 1, albumId: 1, title: 'Photo 1', url: 'url1', thumbnailUrl: 'thumb1' },
    { id: 2, albumId: 1, title: 'Photo 2', url: 'url2', thumbnailUrl: 'thumb2' },
    { id: 3, albumId: 1, title: 'Photo 3', url: 'url3', thumbnailUrl: 'thumb3' },
  ];

  beforeEach(async () => {
    photoState = new MockPhotoStateService();
    router = {
      navigate: vi.fn(),
    };
    routeParams$ = new Subject();

    await TestBed.configureTestingModule({
      imports: [PhotoList],
      providers: [
        { provide: PHOTO_STATE_SERVICE, useValue: photoState },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            params: routeParams$.asObservable(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoList);
    component = fixture.componentInstance;
  });

  /* ===================== Creation ===================== */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* ===================== Initialization ===================== */

  it('should load album and photos on init when albumId is present', () => {
    const albumSpy = vi.spyOn(photoState, 'loadAlbumById');
    const photosSpy = vi.spyOn(photoState, 'loadPhotosByAlbumId');

    component.ngOnInit();
    routeParams$.next({ albumId: '1' });

    // Since your mock service is synchronous, no need to tick()
    expect(albumSpy).toHaveBeenCalledWith(1);
    expect(photosSpy).toHaveBeenCalledWith(1);
  });

  it('should not load data if albumId is missing', () => {
    const albumSpy = vi.spyOn(photoState, 'loadAlbumById');

    component.ngOnInit();
    routeParams$.next({}); // empty params

    expect(albumSpy).not.toHaveBeenCalled();
  });

  /* ===================== Signals ===================== */

  it('should expose photo state signals', () => {
    expect(component.photos).toBeDefined();
    expect(component.album).toBeDefined();
    expect(component.isLoading).toBeDefined();
    expect(component.error).toBeDefined();
  });

  /* ===================== Pagination ===================== */

  describe('Pagination', () => {
    beforeEach(() => {
      photoState.setPhotos(TEST_PHOTOS);
      component.itemsPerPage.set(2);
      fixture.detectChanges(); // triggers component updates
    });

    it('should paginate photos correctly (page 1)', () => {
      component.currentPage.set(1);

      const paginated = component.paginatedPhotos();

      expect(paginated.length).toBe(2);
      expect(paginated[0].id).toBe(1);
      expect(paginated[1].id).toBe(2);
    });

    it('should paginate photos correctly (page 2)', () => {
      component.currentPage.set(2);

      const paginated = component.paginatedPhotos();

      expect(paginated.length).toBe(1);
      expect(paginated[0].id).toBe(3);
    });

    it('should compute totalPhotos correctly', () => {
      expect(component.totalPhotos()).toBe(3);
    });

    it('should scroll to top on page change', () => {
      const scrollSpy = vi.spyOn(window, 'scrollTo');

      component.onPageChange(2);

      expect(component.currentPage()).toBe(2);
      expect(scrollSpy).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    it('should handle page change event wrapper', () => {
      const spy = vi.spyOn(component, 'onPageChange');

      component.onPageChangeEvent(3);

      expect(spy).toHaveBeenCalledWith(3);
    });
  });

  /* ===================== Navigation ===================== */

  it('should navigate back to photos list', () => {
    component.goBack();

    expect(router.navigate).toHaveBeenCalledWith(['/photos']);
  });

  /* ===================== TrackBy ===================== */

  it('should track photo by id', () => {
    const photo = TEST_PHOTOS[0];

    const result = component.trackByPhotoId(0, photo);

    expect(result).toBe(photo.id);
  });

  /* ===================== Image Error ===================== */

  it('should replace image src on error', () => {
    const img = document.createElement('img');
    img.src = 'broken';

    const event = { target: img } as unknown as Event;

    component.onImageError(event);

    expect(img.src).toContain('via.placeholder.com');
  });

  /* ===================== Error State ===================== */

  it('should expose error when state has error', () => {
    photoState.setError('Failed to load photos');
    fixture.detectChanges(); // update the component

    expect(component.error()).toBe('Failed to load photos');
  });

  /* ===================== Loading State ===================== */

  it('should reflect loading state', () => {
    photoState.setLoading(true);
    fixture.detectChanges(); // update component bindings

    expect(component.isLoading()).toBe(true);
  });
});
