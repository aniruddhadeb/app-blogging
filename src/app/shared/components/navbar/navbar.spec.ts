import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Navbar } from './navbar';
import { AUTH_SERVICE, STORAGE_SERVICE, THEME_SERVICE } from '../../../core/tokens/service.tokens';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MockAuthService } from '../../../testing/mocks/auth-service.mock';
import { MockThemeService } from '../../../testing/mocks/theme-service.mock';
import { MockStorageService } from '../../../testing/mocks/storage-service.mock';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let authService: MockAuthService;
  let themeService: MockThemeService;
  let storageService: MockStorageService;

  beforeEach(async () => {
    authService = new MockAuthService();
    themeService = new MockThemeService();
    storageService = new MockStorageService();

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        { provide: AUTH_SERVICE, useValue: authService },
        { provide: THEME_SERVICE, useValue: themeService },
        {
          provide: ActivatedRoute,
          useValue: { params: of({}), snapshot: { params: {} } },
        },
        { provide: STORAGE_SERVICE, useValue: storageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.logout when onLogout is called', () => {
    component.onLogout();
    expect(authService.currentUser()).toBe(null); 
  });

  it('should show user initials when logged in', () => {
    authService.setCurrentUser({
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
      password: 'password123',
    });
    fixture.detectChanges();
    expect(component.initials).toBe('TU');
    expect(component.isLoggedIn).toBe(true);
  });

  it('should show empty initials when not logged in', () => {
    authService.setCurrentUser(null);
    fixture.detectChanges();
    expect(component.initials).toBe('');
    expect(component.isLoggedIn).toBe(false);
  });
});
