import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogList } from './blog-list';
import { BLOG_STATE_SERVICE } from '../../tokens/blog.tokens';
import { MockBlogStateService } from '../../../../testing/mocks/blog-state-service.mock';
import { TEST_POSTS } from '../../../../testing/test-data/test-data';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('BlogList', () => {
  let component: BlogList;
  let fixture: ComponentFixture<BlogList>;
  let mockBlogState: MockBlogStateService;

  beforeEach(async () => {
    mockBlogState = new MockBlogStateService();

    await TestBed.configureTestingModule({
      imports: [BlogList],
      providers: [
        { provide: BLOG_STATE_SERVICE, useValue: mockBlogState },
        {
          provide: ActivatedRoute,
          useValue: { params: of({}), snapshot: { params: {} } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load posts on init', fakeAsync(() => {
      spyOn(mockBlogState, 'loadPosts');

      component.ngOnInit();
      tick();

      expect(mockBlogState.loadPosts).toHaveBeenCalled();
    }));

    it('should display loading state initially', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      // After loadPosts completes, loading should be false
      expect(mockBlogState.isLoading()).toBeFalsy();
    }));
  });

  describe('Pagination', () => {
    beforeEach(fakeAsync(() => {
      mockBlogState.setPosts(TEST_POSTS);
      component.itemsPerPage.set(2);
      fixture.detectChanges();
      tick();
    }));

    it('should paginate posts correctly', () => {
      component.currentPage.set(1);
      const page1Posts = component.paginatedPosts();

      expect(page1Posts.length).toBe(2);
      expect(page1Posts[0].id).toBe(1);
      expect(page1Posts[1].id).toBe(2);
    });

    it('should show correct posts on page 2', () => {
      component.currentPage.set(2);
      const page2Posts = component.paginatedPosts();

      expect(page2Posts.length).toBe(1);
      expect(page2Posts[0].id).toBe(3);
    });

    it('should calculate total posts correctly', () => {
      expect(component.totalPosts()).toBe(3);
    });

    it('should handle page change', () => {
      const scrollSpy = spyOn(window, 'scrollTo') as jasmine.Spy;

      component.onPageChange(2);

      expect(component.currentPage()).toBe(2);
      expect(scrollSpy).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    it('should display all posts when items per page is greater than total', () => {
      component.itemsPerPage.set(10);
      const posts = component.paginatedPosts();

      expect(posts.length).toBe(3);
    });
  });

  describe('TrackBy Function', () => {
    it('should track posts by id', () => {
      const post = TEST_POSTS[0];
      const result = component.trackByPostId(0, post);

      expect(result).toBe(post.id);
    });
  });

  describe('Error Handling', () => {
    it('should display error message when posts fail to load', fakeAsync(() => {
      mockBlogState.setError('Failed to load posts');
      fixture.detectChanges();
      tick();

      expect(component.error()).toBe('Failed to load posts');
    }));
  });

  describe('Empty State', () => {
    it('should handle empty posts list', fakeAsync(() => {
      mockBlogState.setPosts([]);
      fixture.detectChanges();
      tick();

      expect(component.paginatedPosts().length).toBe(0);
      expect(component.totalPosts()).toBe(0);
    }));
  });

  describe('Component State', () => {
    it('should have default pagination values', () => {
      expect(component.currentPage()).toBe(1);
      expect(component.itemsPerPage()).toBe(5);
    });

    it('should expose blog state signals', fakeAsync(() => {
      mockBlogState.setPosts(TEST_POSTS);
      fixture.detectChanges();
      tick();

      expect(component.posts()).toEqual(TEST_POSTS);
      expect(component.isLoading()).toBeDefined();
      expect(component.error()).toBeDefined();
    }));
  });
});
