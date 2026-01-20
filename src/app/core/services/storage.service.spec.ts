import { IStorageService } from '../interfaces/storage-service.interface';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: IStorageService;
  const STORAGE_PREFIX = 'blog_app_';

  // Mock localStorage
  let store: Record<string, string>;

  beforeEach(() => {
    service = new StorageService();

    store = {};

    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      store[key] = value;
    });

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return store[key] || null;
    });

    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete store[key];
    });

    spyOn(localStorage, 'clear').and.callFake(() => {
      store = {};
    });
  });

  it('should save an item to localStorage', () => {
    service.setItem('user', { name: 'Alice' });
    expect(store[STORAGE_PREFIX + 'user']).toBe(JSON.stringify({ name: 'Alice' }));
  });

  it('should retrieve an item from localStorage', () => {
    store[STORAGE_PREFIX + 'user'] = JSON.stringify({ name: 'Bob' });
    const result = service.getItem<{ name: string }>('user');
    expect(result).toEqual({ name: 'Bob' });
  });

  it('should return null if item does not exist', () => {
    const result = service.getItem('nonexistent');
    expect(result).toBeNull();
  });

  it('should remove an item from localStorage', () => {
    store[STORAGE_PREFIX + 'user'] = JSON.stringify({ name: 'Charlie' });
    service.removeItem('user');
    expect(store[STORAGE_PREFIX + 'user']).toBeUndefined();
  });

  it('should clear only items with the prefix', () => {
    store[STORAGE_PREFIX + 'user'] = '1';
    store[STORAGE_PREFIX + 'settings'] = '2';
    store['other_key'] = '3';

    service.clear();

    expect(store[STORAGE_PREFIX + 'user']).toBeUndefined();
    expect(store[STORAGE_PREFIX + 'settings']).toBeUndefined();
    expect(store['other_key']).toBe('3'); // untouched
  });

  it('should handle JSON parsing errors gracefully', () => {
    store[STORAGE_PREFIX + 'bad'] = 'invalid_json';
    spyOn(console, 'error');
    const result = service.getItem('bad');
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle JSON stringifying errors gracefully', () => {
    spyOn(console, 'error');
    const circular: any = {};
    circular.self = circular; // circular reference to trigger JSON.stringify error
    service.setItem('circular', circular);
    expect(console.error).toHaveBeenCalled();
  });
});
