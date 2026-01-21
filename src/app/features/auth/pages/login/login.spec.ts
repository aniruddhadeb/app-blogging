import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Login } from './login';
import { AUTH_SERVICE } from '../../../../core/tokens/service.tokens';
import { MockAuthService } from '../../../../testing/mocks/auth-service.mock';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockAuthService: MockAuthService;
  let mockRouter: Router;
  let mockActivatedRoute: ActivatedRoute;

  beforeEach(async () => {
    mockAuthService = new MockAuthService();
    mockRouter = {
      navigate: vi.fn()
    } as unknown as Router;

    mockActivatedRoute = {
      snapshot: { queryParams: {} }
    } as ActivatedRoute;

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AUTH_SERVICE, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ---------------------------
  // Form Validation
  // ---------------------------
  describe('Form Validation', () => {
    it('should be invalid when empty', () => {
      expect(component.loginForm.invalid).toBe(true);
    });

    it('should require username', () => {
      const control = component.loginForm.controls.username;
      control.setValue('');
      control.markAsTouched();

      expect(control.hasError('required')).toBe(true);
      expect(component.getFieldError('username')).toBe('Username is required');
    });

    it('should validate username minlength', () => {
      const control = component.loginForm.controls.username;
      control.setValue('ab');
      control.markAsTouched();

      expect(control.hasError('minlength')).toBe(true);
      expect(component.getFieldError('username')).toContain('at least 3 characters');
    });

    it('should require password', () => {
      const control = component.loginForm.controls.password;
      control.setValue('');
      control.markAsTouched();

      expect(control.hasError('required')).toBe(true);
      expect(component.getFieldError('password')).toBe('Password is required');
    });

    it('should validate password minlength', () => {
      const control = component.loginForm.controls.password;
      control.setValue('12345');
      control.markAsTouched();

      expect(control.hasError('minlength')).toBe(true);
      expect(component.getFieldError('password')).toContain('at least 6 characters');
    });

    it('should be valid with correct credentials', () => {
      component.loginForm.controls.username.setValue('testuser');
      component.loginForm.controls.password.setValue('password123');

      expect(component.loginForm.valid).toBe(true);
    });
  });

  // ---------------------------
  // Form Submission
  // ---------------------------
  describe('Form Submission', () => {
    it('should not submit if form is invalid', () => {
      component.onSubmit();

      expect((mockRouter.navigate as any).mock.calls.length).toBe(0);
      expect(component.loginForm.controls.username.touched).toBe(true);
      expect(component.loginForm.controls.password.touched).toBe(true);
    });

    it('should login successfully with valid credentials', () => {
      component.loginForm.controls.username.setValue('testuser');
      component.loginForm.controls.password.setValue('password123');

      component.onSubmit();

      expect(mockAuthService.isAuthenticated()).toBe(true);
      expect((mockRouter.navigate as any).mock.calls[0][0]).toEqual(['/blogs']);
    });

    it('should navigate to returnUrl when provided', () => {
      (mockActivatedRoute.snapshot.queryParams as any) = { returnUrl: '/blogs/1' };

      component.loginForm.controls.username.setValue('testuser');
      component.loginForm.controls.password.setValue('password123');

      component.onSubmit();

      expect((mockRouter.navigate as any).mock.calls[0][0]).toEqual(['/blogs/1']);
    });

    it('should show error on invalid credentials', () => {
      component.loginForm.controls.username.setValue('wronguser');
      component.loginForm.controls.password.setValue('wrongpass');

      component.onSubmit();

      expect(component.errorMessage()).toBe('Invalid credentials');
      expect(component.isSubmitting()).toBe(false);
      expect((mockRouter.navigate as any).mock.calls.length).toBe(0);
    });

    it('should clear previous error on submit', () => {
      component.errorMessage.set('Previous error');

      component.loginForm.controls.username.setValue('testuser');
      component.loginForm.controls.password.setValue('password123');

      component.onSubmit();

      expect(component.errorMessage()).toBe('');
    });
  });

  // ---------------------------
  // Helper Methods
  // ---------------------------
  describe('Helper Methods', () => {
    it('should detect field error only after touched', () => {
      const control = component.loginForm.controls.username;
      control.setValue('');

      expect(component.hasFieldError('username')).toBe(false);

      control.markAsTouched();
      expect(component.hasFieldError('username')).toBe(true);
    });

    it('should return empty error message for valid field', () => {
      component.loginForm.controls.username.setValue('testuser');
      component.loginForm.controls.username.markAsTouched();

      expect(component.getFieldError('username')).toBe('');
    });
  });
});
