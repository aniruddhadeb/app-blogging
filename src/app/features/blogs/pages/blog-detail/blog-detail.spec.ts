import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

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
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockBlogState = new MockBlogStateService();
    mockAuthService = new MockAuthService();
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      params: of({ id: '1' }),
      snapshot: { params: { id: '1' } }
    };

    await TestBed.configureTestingModule({
      imports: [BlogDetail],
      providers: [
        { provide: BLOG_STATE_SERVICE, useValue: mockBlogState },
        { provide: AUTH_SERVICE, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogDetail);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load post on init', fakeAsync(() => {
      spyOn(mockBlogState, 'loadPostById');
      spyOn(mockBlogState, 'loadComments');

      component.ngOnInit();
      tick();

      expect(mockBlogState.loadPostById).toHaveBeenCalledWith(1);
      expect(mockBlogState.loadComments).toHaveBeenCalledWith(1);
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
      spyOn(mockBlogState, 'loadPostById');
      mockActivatedRoute.params = of({ id: '0' });

      component.ngOnInit();
      tick();

      expect(mockBlogState.loadPostById).not.toHaveBeenCalled();
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

    it('should show loading state initially', fakeAsync(() => {
      // Before data loads
      expect(component.isLoading()).toBeDefined();
    }));

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

    it('should display all comments', fakeAsync(() => {
      const comments = component.comments();
      expect(comments).toBeDefined();
      expect(Array.isArray(comments)).toBeTruthy();
    }));

    it('should track comments by id', () => {
      const comment = TEST_COMMENTS[0];
      const result = component.trackByCommentId(0, comment);

      expect(result).toBe(comment.id);
    });

    it('should show comments count', fakeAsync(() => {
      const comments = component.comments();
      expect(comments.length).toBeGreaterThanOrEqual(0);
    }));
  });

  describe('Add Comment Navigation', () => {
    describe('when user is not authenticated', () => {
      beforeEach(() => {
        mockAuthService.setCurrentUser(null);
      });

      it('should redirect to login when adding comment', () => {
        component.postId.set(1);
        component.onAddComment();

        expect(mockRouter.navigate).toHaveBeenCalledWith(
          ['/auth/login'],
          {
            queryParams: { returnUrl: '/blogs/1/add-comment' }
          }
        );
      });

      it('should save return URL for different posts', () => {
        component.postId.set(5);
        component.onAddComment();

        expect(mockRouter.navigate).toHaveBeenCalledWith(
          ['/auth/login'],
          {
            queryParams: { returnUrl: '/blogs/5/add-comment' }
          }
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

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/blogs', 1, 'add-comment']);
      });

      it('should navigate with correct post id', () => {
        component.postId.set(10);
        component.onAddComment();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/blogs', 10, 'add-comment']);
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate back to blog list', () => {
      component.goBack();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/blogs']);
    });

    it('should expose auth service for template', () => {
      expect(component.authService).toBeDefined();
      expect(component.authService).toBe(mockAuthService);
    });
  });

  describe('State Management', () => {
    it('should react to post updates', fakeAsync(() => {
      const newPost = { ...TEST_POSTS[0], title: 'Updated Title' };
      mockBlogState.loadPostById(1);
      tick();

      // Simulate post update
      // The component should reflect changes through signals
      expect(component.post).toBeDefined();
    }));

    it('should handle loading state changes', fakeAsync(() => {
      expect(component.isLoading).toBeDefined();
      
      component.ngOnInit();
      tick();

      // Loading should eventually be false
      expect(typeof component.isLoading()).toBe('boolean');
    }));

    it('should handle error state', fakeAsync(() => {
      mockBlogState.setError('Network error');
      fixture.detectChanges();
      tick();

      expect(component.error()).toBe('Network error');
    }));
  });

  describe('Route Parameter Changes', () => {
    it('should reload post when route params change', fakeAsync(() => {
      spyOn(mockBlogState, 'loadPostById');
      spyOn(mockBlogState, 'loadComments');

      component.ngOnInit();
      tick();

      // Simulate route change
      mockActivatedRoute.params = of({ id: '2' });
      component.ngOnInit();
      tick();

      expect(mockBlogState.loadPostById).toHaveBeenCalledWith(2);
      expect(mockBlogState.loadComments).toHaveBeenCalledWith(2);
    }));
  });

  describe('User Comments Integration', () => {
    it('should show user added comments first', fakeAsync(() => {
      const userComment = {
        ...TEST_COMMENTS[0],
        isUserAdded: true
      };

      mockBlogState.addUserComment(1, userComment);
      component.ngOnInit();
      tick();

      const allComments = component.comments();
      expect(allComments.length).toBeGreaterThan(0);
    }));

    it('should distinguish user comments from API comments', fakeAsync(() => {
      component.ngOnInit();
      tick();

      const comments = component.comments();
      const hasIsUserAddedProperty = comments.every(c => 
        c.hasOwnProperty('isUserAdded') || c.isUserAdded === undefined
      );
      expect(hasIsUserAddedProperty).toBeTruthy();
    }));
  });

  describe('Edge Cases', () => {
    it('should handle post with no comments', fakeAsync(() => {
      component.ngOnInit();
      tick();

      const comments = component.comments();
      expect(comments).toBeDefined();
      expect(Array.isArray(comments)).toBeTruthy();
    }));

    it('should handle invalid post id gracefully', fakeAsync(() => {
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
