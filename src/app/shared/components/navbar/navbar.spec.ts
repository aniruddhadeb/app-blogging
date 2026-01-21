import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Navbar } from './navbar';
import { AUTH_SERVICE, THEME_SERVICE } from '../../../core/tokens/service.tokens';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

// ===================== Mock Services =====================

class MockAuthService {
  logout = vi.fn();
  isAuthenticated = vi.fn(() => true);
  userInitials = vi.fn(() => 'AB');
}

class MockThemeService {
  toggleTheme = vi.fn();
  isDarkMode = vi.fn(() => false);
}

// ===================== Test Suite =====================

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let authService: MockAuthService;
  let themeService: MockThemeService;

  beforeEach(async () => {
    authService = new MockAuthService();
    themeService = new MockThemeService();

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        { provide: AUTH_SERVICE, useValue: authService },
        { provide: THEME_SERVICE, useValue: themeService },
        {
          provide: ActivatedRoute,
          useValue: { params: of({}), snapshot: { params: {} } },
        },
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
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should call themeService.toggleTheme when toggleTheme is called', () => {
    component.toggleTheme();
    expect(themeService.toggleTheme).toHaveBeenCalled();
  });

  it('should display user initials when authenticated', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('AB');
  });

  it('should show Login link when not authenticated', () => {
    authService.isAuthenticated.mockReturnValue(false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Login');
  });
});
