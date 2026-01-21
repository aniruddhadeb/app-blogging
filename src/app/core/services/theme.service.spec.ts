import { TestBed } from '@angular/core/testing';
import { describe, it, beforeEach, expect } from 'vitest';
import { ThemeService } from './theme.service';
import { STORAGE_SERVICE } from '../tokens/service.tokens';
import { MockStorageService } from '../../testing/mocks/storage-service.mock';

describe('ThemeService', () => {
  let service: ThemeService;
  let storage: MockStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: STORAGE_SERVICE, useClass: MockStorageService }],
    });

    storage = TestBed.inject(STORAGE_SERVICE) as MockStorageService;
    storage.setItem('theme', true); // pre-set storage
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load theme from storage', () => {
    // Only check signal value
    expect(service.isDarkMode()).toBe(true);
    // Optionally check storage read
    expect(storage.getItem('theme')).toBe(true);
  });

  it('should toggle theme signal', () => {
    const initial = service.isDarkMode();
    service.toggleTheme();
    expect(service.isDarkMode()).toBe(!initial);
    service.toggleTheme();
    expect(service.isDarkMode()).toBe(initial);
  });
});
