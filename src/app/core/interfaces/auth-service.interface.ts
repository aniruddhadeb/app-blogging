import { Signal } from '@angular/core';
import { User, LoginCredentials } from '../models/user.model';

export interface IAuthService {
  currentUser: Signal<User | null>;
  isAuthenticated: Signal<boolean>;
  userInitials: Signal<string>;
  signup(user: User): { success: boolean; message: string };
  login(credentials: LoginCredentials): { success: boolean; message: string };
  logout(): void;
}