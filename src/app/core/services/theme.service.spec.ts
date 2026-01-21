import { TestBed } from '@angular/core/testing';
import { describe, it, beforeEach, vi, expect } from 'vitest';
import { ThemeService } from './theme.service';
import { IStorageService } from '../../core/interfaces/storage-service.interface';
import { STORAGE_SERVICE } from '../tokens/service.tokens';
import { MockStorageService } from '../../testing/mocks/storage-service.mock';

describe('ThemeService', () => {
  let service: ThemeService;
  let storage: IStorageService;

  beforeEach(() => {
    // Clear document classes before each test
    document.documentElement.className = '';

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: STORAGE_SERVICE, useClass: MockStorageService }
      ]
    });

    service = TestBed.inject(ThemeService);
    storage = TestBed.inject(STORAGE_SERVICE);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with light mode by default', () => {
    expect(service.isDarkMode()).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should load saved theme from storage', () => {
    storage.setItem('theme', true);
    // Recreate service to trigger constructor
    service = new ThemeService();

    expect(service.isDarkMode()).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should toggle theme', () => {
    expect(service.isDarkMode()).toBe(false);

    service.toggleTheme();
    expect(service.isDarkMode()).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(storage.getItem('theme')).toBe(true);

    service.toggleTheme();
    expect(service.isDarkMode()).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(storage.getItem('theme')).toBe(false);
  });

  it('should apply theme effect correctly when signal changes', () => {
    service.isDarkMode.set(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(storage.getItem('theme')).toBe(true);

    service.isDarkMode.set(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(storage.getItem('theme')).toBe(false);
  });
});
