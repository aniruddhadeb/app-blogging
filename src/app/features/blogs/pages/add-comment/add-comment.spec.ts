import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AddComment } from './add-comment';
import { BLOG_STATE_SERVICE } from '../../tokens/blog.tokens';
import { AUTH_SERVICE } from '../../../../core/tokens/service.tokens';
import { TEST_USERS } from '../../../../testing/test-data/test-data';
import { MockBlogStateService } from '../../../../testing/mocks/blog-state-service.mock';
import { MockAuthService } from '../../../../testing/mocks/auth-service.mock';

describe('AddComment', () => {
  let fixture: ComponentFixture<AddComment>;
  let component: AddComment;
  let blogState: MockBlogStateService;
  let authService: MockAuthService;
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    blogState = new MockBlogStateService();
    authService = new MockAuthService();

    router = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AddComment],
      providers: [
        { provide: BLOG_STATE_SERVICE, useValue: blogState },
        { provide: AUTH_SERVICE, useValue: authService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: '1' }) },
        },
      ],
    }).compileComponents();
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(AddComment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  /* ===================== Creation ===================== */

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  /* ===================== Form Initialization ===================== */

  describe('Form initialization', () => {
    it('should prefill name and email when user is logged in', () => {
      authService.setCurrentUser(TEST_USERS[0]);

      createComponent();

      expect(component.commentForm.controls.name.value).toBe('John Doe');
      expect(component.commentForm.controls.email.value).toBe('johndoe@example.com');
      expect(component.commentForm.controls.body.value).toBe('');
    });

    it('should start with empty fields when user is not logged in', () => {
      authService.setCurrentUser(null);

      createComponent();

      expect(component.commentForm.controls.name.value).toBe('');
      expect(component.commentForm.controls.email.value).toBe('');
    });

    it('should expose a strongly typed FormGroup', () => {
      createComponent();

      expect(component.commentForm.controls.name).toBeDefined();
      expect(component.commentForm.controls.email).toBeDefined();
      expect(component.commentForm.controls.body).toBeDefined();
    });
  });

  /* ===================== Validation ===================== */

  describe('Form validation', () => {
    beforeEach(() => createComponent());

    it('should be invalid when empty', () => {
      expect(component.commentForm.invalid).toBe(true);
      expect(component.isFormInvalid()).toBe(true);
    });

    it('should validate name required', () => {
      const name = component.commentForm.controls.name;

      name.setValue('');
      name.markAsTouched();

      expect(name.hasError('required')).toBe(true);
      expect(component.getFieldError('name')).toBe('Name is required');
    });

    it('should validate email format', () => {
      const email = component.commentForm.controls.email;

      email.setValue('invalid');
      email.markAsTouched();

      expect(email.hasError('email')).toBe(true);
    });

    it('should validate body minlength', () => {
      const body = component.commentForm.controls.body;

      body.setValue('short');
      body.markAsTouched();

      expect(body.hasError('minlength')).toBe(true);
      expect(component.getFieldError('body')).toContain('at least 10 characters');
    });
  });

  /* ===================== Submission ===================== */

  describe('Form submission', () => {
    beforeEach(() => {
      authService.setCurrentUser(TEST_USERS[0]);
      createComponent();
    });

    it('should not submit invalid form', () => {
      const spy = vi.spyOn(blogState, 'addUserComment');

      component.onSubmit();

      expect(spy).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

  });

  /* ===================== Route Params ===================== */

  it('should set postId from route params', () => {
    createComponent();
    expect(component.postId()).toBe(1);
  });

  /* ===================== Cancel ===================== */

  it('should navigate back on cancel', () => {
    createComponent();

    component.postId.set(5);
    component.onCancel();

    expect(router.navigate).toHaveBeenCalledWith(['/blogs', 5]);
  });

  /* ===================== UI State ===================== */

  it('should start with isSubmitting false', () => {
    createComponent();
    expect(component.isSubmitting()).toBe(false);
  });
});
