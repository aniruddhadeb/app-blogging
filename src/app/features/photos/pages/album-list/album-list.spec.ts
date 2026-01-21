import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { AlbumList } from './album-list';
import { PHOTO_STATE_SERVICE } from '../../tokens/photo.tokens';
import { TEST_ALBUMS } from '../../../../testing/test-data/test-data';
import { MockPhotoStateService } from '../../../../testing/mocks/photo-state-service.mock';

describe('AlbumList', () => {
  let component: AlbumList;
  let fixture: ComponentFixture<AlbumList>;
  let mockPhotoState: MockPhotoStateService;

  beforeEach(async () => {
    mockPhotoState = new MockPhotoStateService();

    await TestBed.configureTestingModule({
      imports: [AlbumList],
      providers: [
        { provide: PHOTO_STATE_SERVICE, useValue: mockPhotoState },
        {
          provide: ActivatedRoute,
          useValue: { params: of({}), snapshot: { params: {} } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* ===================== Basics ===================== */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* ===================== Initialization ===================== */

  it('should load albums on init', () => {
    const spy = vi.spyOn(mockPhotoState, 'loadAlbums');

    component.ngOnInit();

    expect(spy).toHaveBeenCalledOnce();
  });

  it('should expose loading state initially', () => {
    mockPhotoState.setLoading(true);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);
  });

  /* ===================== Albums Display ===================== */

  it('should expose albums signal', () => {
    mockPhotoState.setAlbums(TEST_ALBUMS);
    fixture.detectChanges();

    expect(component.albums()).toBeDefined();
    expect(Array.isArray(component.albums())).toBe(true);
  });

  it('should display all loaded albums', () => {
    mockPhotoState.setAlbums(TEST_ALBUMS);
    fixture.detectChanges();

    expect(component.albums().length).toBe(TEST_ALBUMS.length);
  });

  it('should display correct album data', () => {
    mockPhotoState.setAlbums(TEST_ALBUMS);
    fixture.detectChanges();

    const albums = component.albums();
    expect(albums[0].id).toBe(TEST_ALBUMS[0].id);
    expect(albums[0].title).toBe(TEST_ALBUMS[0].title);
  });

  it('should handle empty albums list', () => {
    mockPhotoState.setAlbums([]);
    fixture.detectChanges();

    expect(component.albums()).toEqual([]);
  });

  it('should display albums after loading completes', () => {
    mockPhotoState.setLoading(true);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);

    mockPhotoState.setLoading(false);
    mockPhotoState.setAlbums(TEST_ALBUMS);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.albums().length).toBeGreaterThan(0);
  });

  /* ===================== Loading State ===================== */

  it('should hide loading after albums load', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
  });

  it('should expose loading signal', () => {
    expect(typeof component.isLoading).toBe('function');
  });

  /* ===================== Error Handling ===================== */

  it('should display error when albums fail to load', () => {
    mockPhotoState.setError('Failed to load albums');
    fixture.detectChanges();

    expect(component.error()).toBe('Failed to load albums');
  });

  it('should clear error on successful load', () => {
    mockPhotoState.setError('Error');
    fixture.detectChanges();

    mockPhotoState.setError(null);
    mockPhotoState.setAlbums(TEST_ALBUMS);
    fixture.detectChanges();

    expect(component.error()).toBeNull();
  });

  /* ===================== TrackBy ===================== */

  it('should track albums by id', () => {
    const album = TEST_ALBUMS[0];
    const id = component.trackByAlbumId(0, album);

    expect(id).toBe(album.id);
  });

  it('should return same id for same album', () => {
    const album = TEST_ALBUMS[0];

    expect(component.trackByAlbumId(0, album)).toBe(
      component.trackByAlbumId(10, album)
    );
  });

  /* ===================== State Management ===================== */

  it('should react to album state changes', () => {
    mockPhotoState.setAlbums([]);
    fixture.detectChanges();
    expect(component.albums().length).toBe(0);

    mockPhotoState.setAlbums(TEST_ALBUMS);
    fixture.detectChanges();
    expect(component.albums().length).toBe(TEST_ALBUMS.length);
  });

  it('should maintain signal consistency', () => {
    mockPhotoState.setAlbums(TEST_ALBUMS);
    fixture.detectChanges();

    const first = component.albums();
    const second = component.albums();

    expect(first).toBe(second);
  });

  /* ===================== Large Dataset ===================== */

  it('should handle many albums', () => {
    const manyAlbums = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      userId: 1,
      title: `Album ${i + 1}`,
    }));

    mockPhotoState.setAlbums(manyAlbums);
    fixture.detectChanges();

    expect(component.albums().length).toBe(100);
  });
});
