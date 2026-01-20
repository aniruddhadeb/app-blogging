import { Signal, WritableSignal } from '@angular/core';

export interface IThemeService {
  isDarkMode: WritableSignal<boolean>;
  toggleTheme(): void;
}