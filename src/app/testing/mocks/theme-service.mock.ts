import { signal } from '@angular/core';
import { IThemeService } from '../../core/interfaces/theme-service.interface';

export class MockThemeService implements IThemeService {
  isDarkMode = signal<boolean>(false);

  toggleTheme(): void {
    this.isDarkMode.update(current => !current);
  }
}