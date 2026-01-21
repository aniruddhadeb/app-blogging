import { effect, Inject, inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { STORAGE_SERVICE } from '../tokens/service.tokens';
import { IStorageService } from '../interfaces/storage-service.interface';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';

  isDarkMode = signal<boolean>(false);

  constructor(@Inject(STORAGE_SERVICE) private readonly storageService: IStorageService) {
    this.loadTheme();

    effect(() => {
      const isDark = this.isDarkMode();
      this.applyTheme(isDark);
      this.storageService.setItem(this.THEME_KEY, isDark);
    });
  }

  private loadTheme(): void {
    const savedTheme = this.storageService.getItem<boolean>(this.THEME_KEY);
    this.isDarkMode.set(savedTheme ?? false);
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleTheme(): void {
    this.isDarkMode.update((current) => !current);
  }
}
