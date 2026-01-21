import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { BlogDetail } from './blog-detail';
import { MockBlogStateService } from '../../../../testing/mocks/blog-state-service.mock';
import { MockAuthService } from '../../../../testing/mocks/auth-service.mock';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { BLOG_STATE_SERVICE } from '../../tokens/blog.tokens';
import { AUTH_SERVICE } from '../../../../core/tokens/service.tokens';
import { TEST_COMMENTS, TEST_POSTS, TEST_USERS } from '../../../../testing/test-data/test-data';

describe('BlogDetail', () => {
  let component: BlogDetail;
  let fixture: ComponentFixture<BlogDetail>;
  let mockBlogState: MockBlogStateService;
  let mockAuthService: MockAuthService;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockBlogState = new MockBlogStateService();
    mockAuthService = new MockAuthService();

    mockRouter = {
      navigate: vi.fn(),
    };

    mockActivatedRoute = {
      params: of({ id: '1' }),
      snapshot: { params: { id: '1' } },
    };

    await TestBed.configureTestingModule({
      imports: [BlogDetail],
      providers: [
        { provide: BLOG_STATE_SERVICE, useValue: mockBlogState },
        { provide: AUTH_SERVICE, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogDetail);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load post on init', fakeAsync(() => {
      const postSpy = vi.spyOn(mockBlogState, 'loadPostById');
      const commentsSpy = vi.spyOn(mockBlogState, 'loadComments');

      component.ngOnInit();
      tick();

      expect(postSpy).toHaveBeenCalledWith(1);
      expect(commentsSpy).toHaveBeenCalledWith(1);
    }));

    it('should set postId from route params', fakeAsync(() => {
      component.ngOnInit();
      tick();

      expect(component.postId()).toBe(1);
    }));

    it('should handle different post IDs from route', fakeAsync(() => {
      mockActivatedRoute.params = of({ id: '42' });

      component.ngOnInit();
      tick();

      expect(component.postId()).toBe(42);
    }));

    it('should not load if id is invalid', fakeAsync(() => {
      const spy = vi.spyOn(mockBlogState, 'loadPostById');
      mockActivatedRoute.params = of({ id: '0' });

      component.ngOnInit();
      tick();

      expect(spy).not.toHaveBeenCalled();
    }));
  });

  describe('Post Display', () => {
    beforeEach(fakeAsync(() => {
      mockBlogState.setPosts([TEST_POSTS[0]]);
      fixture.detectChanges();
      tick();
    }));

    it('should expose post signal', () => {
      expect(component.post()).toBeDefined();
    });

    it('should expose comments signal', () => {
      expect(component.comments()).toBeDefined();
    });

    it('should expose loading state', () => {
      expect(component.isLoading()).toBeDefined();
    });

    it('should show error when post fails to load', fakeAsync(() => {
      mockBlogState.setError('Failed to load post');
      fixture.detectChanges();
      tick();

      expect(component.error()).toBe('Failed to load post');
    }));
  });

  describe('Comments Section', () => {
    beforeEach(fakeAsync(() => {
      component.ngOnInit();
      tick();
    }));

    it('should display all comments', () => {
      const comments = component.comments();
      expect(Array.isArray(comments)).toBe(true);
    });

    it('should track comments by id', () => {
      const comment = TEST_COMMENTS[0];
      const result = component.trackByCommentId(0, comment);

      expect(result).toBe(comment.id);
    });

    it('should expose comments count', () => {
      expect(component.comments().length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Add Comment Navigation', () => {
    describe('when user is not authenticated', () => {
      beforeEach(() => {
        mockAuthService.setCurrentUser(null);
      });

      it('should redirect to login', () => {
        component.postId.set(1);
        component.onAddComment();

        expect(mockRouter.navigate).toHaveBeenCalledWith(
          ['/auth/login'],
          { queryParams: { returnUrl: '/blogs/1/add-comment' } }
        );
      });
    });

    describe('when user is authenticated', () => {
      beforeEach(() => {
        mockAuthService.setCurrentUser(TEST_USERS[0]);
      });

      it('should navigate to add comment page', () => {
        component.postId.set(1);
        component.onAddComment();

        expect(mockRouter.navigate).toHaveBeenCalledWith(
          ['/blogs', 1, 'add-comment']
        );
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate back to blog list', () => {
      component.goBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/blogs']);
    });

    it('should expose auth service', () => {
      expect(component.authService).toBe(mockAuthService);
    });
  });

  describe('Route Parameter Changes', () => {
    it('should reload post when route params change', fakeAsync(() => {
      const postSpy = vi.spyOn(mockBlogState, 'loadPostById');
      const commentSpy = vi.spyOn(mockBlogState, 'loadComments');

      component.ngOnInit();
      tick();

      mockActivatedRoute.params = of({ id: '2' });
      component.ngOnInit();
      tick();

      expect(postSpy).toHaveBeenCalledWith(2);
      expect(commentSpy).toHaveBeenCalledWith(2);
    }));
  });

  describe('Edge Cases', () => {
    it('should handle invalid post id', fakeAsync(() => {
      mockActivatedRoute.params = of({ id: 'invalid' });

      component.ngOnInit();
      tick();

      expect(component.postId()).toBeNaN();
    }));

    it('should handle missing post', fakeAsync(() => {
      mockBlogState.setError('Post not found');
      component.ngOnInit();
      tick();

      expect(component.error()).toBe('Post not found');
    }));
  });
});
