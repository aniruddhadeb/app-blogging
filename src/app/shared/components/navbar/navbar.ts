import { Component, inject } from '@angular/core';
import { AUTH_SERVICE } from '../../../core/tokens/service.tokens';
import { ThemeService } from '../../../core/services/theme.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HlmButton } from '@shared/ui/button';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, HlmButton],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  authService = inject(AUTH_SERVICE);
  themeService = inject(ThemeService);

  onLogout(): void {
    this.authService.logout();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  get initials(): string {
    return this.authService.userInitials();
  }
}
