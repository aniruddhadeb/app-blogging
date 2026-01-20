import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

describe('AuthService', () => {
  let service: AuthService;
  let storageSpy: jasmine.SpyObj<StorageService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser = {
    username: 'testuser',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe'
  };

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('StorageService', [
      'getItem',
      'setItem',
      'removeItem'
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: StorageService, useValue: storageSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    storageSpy.getItem.and.returnValue(null);

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should not be authenticated initially', () => {
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.currentUser()).toBeNull();
  });

  it('should return empty initials when no user', () => {
    expect(service.userInitials()).toBe('');
  });


  it('should signup a new user successfully', () => {
    storageSpy.getItem.and.returnValue([]);

    const result = service.signup(mockUser);

    expect(result.success).toBeTrue();
    expect(storageSpy.setItem).toHaveBeenCalledWith('users', [mockUser]);
  });

  it('should fail signup if username already exists', () => {
    storageSpy.getItem.and.returnValue([mockUser]);

    const result = service.signup(mockUser);

    expect(result.success).toBeFalse();
    expect(result.message).toBe('Username already exists');
  });

  it('should login successfully with valid credentials', () => {
    storageSpy.getItem.and.returnValue([mockUser]);

    const result = service.login({
      username: 'testuser',
      password: 'password123'
    });

    expect(result.success).toBeTrue();
    expect(service.currentUser()).toEqual(mockUser);
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.userInitials()).toBe('JD');
  });

  it('should fail login with invalid credentials', () => {
    storageSpy.getItem.and.returnValue([mockUser]);

    const result = service.login({
      username: 'wrong',
      password: 'wrong'
    });

    expect(result.success).toBeFalse();
    expect(service.currentUser()).toBeNull();
  });


  it('should logout user and navigate to login', () => {
    (service as any).currentUserSignal.set(mockUser);

    service.logout();

    expect(service.currentUser()).toBeNull();
    expect(storageSpy.removeItem).toHaveBeenCalledWith('current_user');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});

