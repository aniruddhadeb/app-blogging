import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Signup } from './signup';
import { AUTH_SERVICE } from '../../../../core/tokens/service.tokens';
import { MockAuthService } from '../../../../testing/mocks/auth-service.mock';
import { of } from 'rxjs';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let authService: MockAuthService;
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authService = new MockAuthService();
    router = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Signup],
      providers: [
        { provide: AUTH_SERVICE, useValue: authService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: { params: {} },
          },
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* ===================== Basics ===================== */

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.signupForm).toBeDefined();
  });

  it('should initialize form as invalid', () => {
    expect(component.signupForm.invalid).toBe(true);
  });

  /* ===================== Validation ===================== */

  it('should require firstName', () => {
    const control = component.signupForm.controls.firstName;
    control.setValue('');
    control.markAsTouched();

    expect(control.hasError('required')).toBe(true);
    expect(component.getFieldError('firstName')).toBe('First name is required');
  });

  it('should detect password mismatch', () => {
    component.signupForm.controls.password.setValue('password123');
    component.signupForm.controls.confirmPassword.setValue('password456');
    component.signupForm.controls.confirmPassword.markAsTouched();

    expect(component.signupForm.hasError('passwordMismatch')).toBe(true);
    expect(component.getFieldError('confirmPassword')).toBe('Passwords do not match');
  });

  it('should be valid with correct data', () => {
    component.signupForm.setValue({
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(component.signupForm.valid).toBe(true);
  });

  /* ===================== Submission ===================== */

  it('should not submit when form is invalid', () => {
    component.onSubmit();

    expect(component.signupForm.touched).toBe(true);
    expect(component.isSubmitting()).toBe(false);
  });

  it('should signup successfully and navigate to login', () => {
    vi.useFakeTimers();

    component.signupForm.setValue({
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123',
    });

    component.onSubmit();

    expect(component.successMessage()).toBe('Signup successful');
    expect(component.errorMessage()).toBe('');

    vi.advanceTimersByTime(2000);

    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);

    vi.useRealTimers();
  });

  /* ===================== Helper methods ===================== */

  it('hasFieldError should be false if untouched', () => {
    component.signupForm.controls.username.setValue('');
    expect(component.hasFieldError('username')).toBe(false);
  });

  it('hasFieldError should be true if invalid and touched', () => {
    const control = component.signupForm.controls.username;
    control.setValue('');
    control.markAsTouched();

    expect(component.hasFieldError('username')).toBe(true);
  });

  it('getFieldError should return empty string for valid field', () => {
    component.signupForm.controls.username.setValue('testuser');
    component.signupForm.controls.username.markAsTouched();

    expect(component.getFieldError('username')).toBe('');
  });
});
