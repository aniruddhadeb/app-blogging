import { TestBed } from '@angular/core/testing';
import { describe, it, beforeEach, expect } from 'vitest';
import { IAuthService } from '../../core/interfaces/auth-service.interface';
import { AUTH_SERVICE } from '../tokens/service.tokens';
import { MockAuthService } from '../../testing/mocks/auth-service.mock';
import { TEST_USERS } from '../../testing/test-data/test-data';

describe('MockAuthService', () => {
  let authService: IAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AUTH_SERVICE, useClass: MockAuthService }
      ]
    });

    authService = TestBed.inject(AUTH_SERVICE);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should not be authenticated initially', () => {
    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.currentUser()).toBeNull();
  });

  it('should return empty initials when no user', () => {
    expect(authService.userInitials()).toBe('');
  });

  it('should login successfully with valid credentials', () => {
    const result = authService.login({
      username: 'testuser',
      password: 'password123'
    });

    expect(result.success).toBe(true);
    expect(authService.currentUser()?.username).toBe('testuser');
    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.userInitials()).toBe('TU');
  });

  it('should fail login with invalid credentials', () => {
    const result = authService.login({
      username: 'wronguser',
      password: 'wrongpass'
    });

    expect(result.success).toBe(false);
    expect(authService.currentUser()).toBeNull();
    expect(authService.isAuthenticated()).toBe(false);
  });

  it('should logout user', () => {
    authService.login({
      username: 'testuser',
      password: 'password123'
    });

    authService.logout();

    expect(authService.currentUser()).toBeNull();
    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.userInitials()).toBe('');
  });

  it('should set current user using helper', () => {
    (authService as MockAuthService).setCurrentUser(TEST_USERS[0]);

    expect(authService.currentUser()?.username).toBe(TEST_USERS[0].username);
    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.userInitials()).toBe('JD');
  });
});
