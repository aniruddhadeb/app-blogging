import { IStorageService } from '../../core/interfaces/storage-service.interface';

export class MockStorageService implements IStorageService {
  private storage = new Map<string, any>();

  setItem<T>(key: string, value: T): void {
    this.storage.set(key, value);
  }

  getItem<T>(key: string): T | null {
    return this.storage.get(key) || null;
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  // Helper for tests
  getStorage(): Map<string, any> {
    return this.storage;
  }
}