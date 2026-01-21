import { effect, inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageService = inject(StorageService);
  private readonly THEME_KEY = 'theme';
  
  isDarkMode = signal<boolean>(false);

  constructor() {
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
    this.isDarkMode.update(current => !current);
  }
}
