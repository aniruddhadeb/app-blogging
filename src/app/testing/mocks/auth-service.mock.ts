import { signal, computed } from '@angular/core';
import { IAuthService } from '../../core/interfaces/auth-service.interface';
import { User, LoginCredentials } from '../../core/models/user.model';

export class MockAuthService implements IAuthService {
  private _currentUser = signal<User | null>(null);
  
  currentUser = this._currentUser.asReadonly();
  isAuthenticated = computed(() => this._currentUser() !== null);
  userInitials = computed(() => {
    const user = this._currentUser();
    if (!user) return '';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  });

  signup(user: User): { success: boolean; message: string } {
    return { success: true, message: 'Signup successful' };
  }

  login(credentials: LoginCredentials): { success: boolean; message: string } {
    if (credentials.username === 'testuser' && credentials.password === 'password123') {
      this._currentUser.set({
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
        password: 'password123'
      });
      return { success: true, message: 'Login successful' };
    }
    return { success: false, message: 'Invalid credentials' };
  }

  logout(): void {
    this._currentUser.set(null);
  }

  // Helper for tests
  setCurrentUser(user: User | null): void {
    this._currentUser.set(user);
  }
}
