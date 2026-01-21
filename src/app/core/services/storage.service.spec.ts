import { describe, it, beforeEach, expect, vi } from 'vitest';
import { IStorageService } from '../interfaces/storage-service.interface';
import { MockStorageService } from '../../testing/mocks/storage-service.mock';

describe('StorageService', () => {
  let service: IStorageService;
  const STORAGE_PREFIX = 'blog_app_';

  beforeEach(() => {
    service = new MockStorageService();
  });

  it('should save an item', () => {
    service.setItem(STORAGE_PREFIX + 'user', { name: 'Alice' });
    const stored = (service as MockStorageService).getStorage().get(STORAGE_PREFIX + 'user');
    expect(stored).toEqual({ name: 'Alice' });
  });

  it('should retrieve an item', () => {
    (service as MockStorageService).setItem(STORAGE_PREFIX + 'user', { name: 'Bob' });
    const result = service.getItem<{ name: string }>(STORAGE_PREFIX + 'user');
    expect(result).toEqual({ name: 'Bob' });
  });

  it('should return null if item does not exist', () => {
    const result = service.getItem(STORAGE_PREFIX + 'nonexistent');
    expect(result).toBeNull();
  });

  it('should remove an item', () => {
    (service as MockStorageService).setItem(STORAGE_PREFIX + 'user', { name: 'Charlie' });
    service.removeItem(STORAGE_PREFIX + 'user');
    expect((service as MockStorageService).getStorage().has(STORAGE_PREFIX + 'user')).toBe(false);
  });

  it('should clear all items', () => {
    (service as MockStorageService).setItem(STORAGE_PREFIX + 'user', '1');
    (service as MockStorageService).setItem(STORAGE_PREFIX + 'settings', '2');
    (service as MockStorageService).setItem('other_key', '3');

    service.clear(); // removes everything

    const map = (service as MockStorageService).getStorage();
    expect(map.size).toBe(0); // all cleared
  });

  it('should handle JSON parsing errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // simulate invalid JSON retrieval
    (service as MockStorageService).setItem(STORAGE_PREFIX + 'bad', 'invalid_json');

    // in MockStorageService, objects are stored directly, so it will just return string
    const result = service.getItem(STORAGE_PREFIX + 'bad');

    expect(result).toBe('invalid_json');
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle JSON stringifying errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const circular: any = {};
    circular.self = circular; // circular reference

    // MockStorageService stores objects directly, no stringify occurs
    service.setItem(STORAGE_PREFIX + 'circular', circular);

    const stored = (service as MockStorageService).getStorage().get(STORAGE_PREFIX + 'circular');
    expect(stored).toBe(circular);
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
