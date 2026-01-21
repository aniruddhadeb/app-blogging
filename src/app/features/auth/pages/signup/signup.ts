import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AUTH_SERVICE } from '../../../../core/tokens/service.tokens';
import { IAuthService } from '../../../../core/interfaces/auth-service.interface';
import { HlmButton } from '@shared/ui/button';
import { HlmError, HlmFormField } from '@shared/ui/form-field';
import { HlmLabel } from '@shared/ui/label';
import { HlmInput } from '@shared/ui/input';

/* ===================== Typed Form Model ===================== */

interface SignupForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  username: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HlmButton,
    HlmFormField,
    HlmError,
    HlmLabel,
    HlmInput,
  ],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class Signup {
  private readonly authService: IAuthService = inject(AUTH_SERVICE);
  private readonly router = inject(Router);

  /* ===================== Signal-backed Form ===================== */

  private readonly _form = signal<FormGroup<SignupForm>>(this.createForm());

  get signupForm(): FormGroup<SignupForm> {
    return this._form();
  }

  /* ===================== UI State Signals ===================== */

  errorMessage = signal('');
  successMessage = signal('');
  isSubmitting = signal(false);

  /* ===================== Form Factory ===================== */

  private createForm(): FormGroup<SignupForm> {
    return new FormGroup(
      {
        firstName: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(2)],
        }),
        lastName: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(2)],
        }),
        username: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(3)],
        }),
        password: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(6)],
        }),
        confirmPassword: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      },
      { validators: this.passwordMatchValidator },
    );
  }

  /* ===================== Validators ===================== */

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /* ===================== Getters ===================== */

  get firstName(): FormControl<string> {
    return this.signupForm.controls.firstName;
  }

  get lastName(): FormControl<string> {
    return this.signupForm.controls.lastName;
  }

  get username(): FormControl<string> {
    return this.signupForm.controls.username;
  }

  get password(): FormControl<string> {
    return this.signupForm.controls.password;
  }

  get confirmPassword(): FormControl<string> {
    return this.signupForm.controls.confirmPassword;
  }

  /* ===================== Submit ===================== */

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { confirmPassword, ...payload } = this.signupForm.getRawValue();
    const result = this.authService.signup(payload);

    if (result.success) {
      this.successMessage.set(result.message);
      setTimeout(() => this.router.navigate(['/auth/login']), 2000);
    } else {
      this.errorMessage.set(result.message);
      this.isSubmitting.set(false);
    }
  }

  /* ===================== Error Helpers ===================== */

  getFieldError(field: keyof SignupForm): string {
    const control = this.signupForm.controls[field];

    if (control.hasError('required') && control.touched) {
      return `${this.label(field)} is required`;
    }

    if (control.hasError('minlength') && control.touched) {
      const min = control.errors?.['minlength']?.requiredLength;
      return `${this.label(field)} must be at least ${min} characters`;
    }

    if (
      field === 'confirmPassword' &&
      this.signupForm.hasError('passwordMismatch') &&
      control.touched
    ) {
      return 'Passwords do not match';
    }

    return '';
  }

  hasFieldError(field: keyof SignupForm): boolean {
    const control = this.signupForm.controls[field];
    const groupError = field === 'confirmPassword' && this.signupForm.hasError('passwordMismatch');

    return (control.invalid && control.touched) || groupError;
  }

  private label(field: keyof SignupForm): string {
    return {
      firstName: 'First name',
      lastName: 'Last name',
      username: 'Username',
      password: 'Password',
      confirmPassword: 'Confirm password',
    }[field];
  }
  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
