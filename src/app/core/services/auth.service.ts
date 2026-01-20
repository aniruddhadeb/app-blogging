import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginCredentials } from '../models/user.model';
import { StorageService } from './storage.service';
import { IAuthService } from '../interfaces/auth-service.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService {
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);
  
  private readonly USERS_KEY = 'users';
  private readonly CURRENT_USER_KEY = 'current_user';
  
  private currentUserSignal = signal<User | null>(null);
  
  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = computed(() => this.currentUserSignal() !== null);
  userInitials = computed(() => {
    const user = this.currentUserSignal();
    if (!user) return '';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  });

  constructor() {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const user = this.storageService.getItem<User>(this.CURRENT_USER_KEY);
    if (user) {
      this.currentUserSignal.set(user);
    }
  }

  signup(user: User): { success: boolean; message: string } {
    const users = this.storageService.getItem<User[]>(this.USERS_KEY) || [];
    
    const existingUser = users.find(u => u.username === user.username);
    if (existingUser) {
      return { success: false, message: 'Username already exists' };
    }

    users.push(user);
    this.storageService.setItem(this.USERS_KEY, users);
    
    return { success: true, message: 'Signup successful' };
  }

  login(credentials: LoginCredentials): { success: boolean; message: string } {
    const users = this.storageService.getItem<User[]>(this.USERS_KEY) || [];
    
    const user = users.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      return { success: false, message: 'Invalid username or password' };
    }

    this.currentUserSignal.set(user);
    this.storageService.setItem(this.CURRENT_USER_KEY, user);
    
    return { success: true, message: 'Login successful' };
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.storageService.removeItem(this.CURRENT_USER_KEY);
    this.router.navigate(['/login']);
  }
}