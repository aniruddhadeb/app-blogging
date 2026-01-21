import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { IAuthService } from '../../../../core/interfaces/auth-service.interface';
import { AUTH_SERVICE } from '../../../../core/tokens/service.tokens';
import { HlmButton } from '@shared/ui/button';
import { HlmError, HlmFormField } from '@shared/ui/form-field';
import { HlmLabel } from '@shared/ui/label';
import { HlmInput } from '@shared/ui/input';

/* ===================== Typed Form ===================== */

export interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
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
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService: IAuthService = inject(AUTH_SERVICE);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /* ===================== Signals ===================== */

  readonly errorMessage = signal<string>('');
  readonly isSubmitting = signal<boolean>(false);

  /* ===================== Typed Reactive Form (Signal-backed) ===================== */

  private readonly _form = signal<FormGroup<LoginForm>>(this.createForm());

  get loginForm(): FormGroup<LoginForm> {
    return this._form();
  }

  /* ===================== Actions ===================== */

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const { username, password } = this.loginForm.getRawValue();

    const result = this.authService.login({ username, password });

    if (result.success) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/blogs';
      this.router.navigate([returnUrl]);
    } else {
      this.errorMessage.set(result.message);
      this.isSubmitting.set(false);
    }
  }

  /* ===================== Validation Helpers ===================== */

  hasFieldError(field: keyof LoginForm): boolean {
    const control = this.loginForm.controls[field];
    return control.invalid && control.touched;
  }

  getFieldError(field: keyof LoginForm): string {
    const control = this.loginForm.controls[field];
    if (!control.touched) return '';

    if (control.hasError('required')) {
      return `${this.label(field)} is required`;
    }

    if (control.hasError('minlength')) {
      const length = control.getError('minlength')!.requiredLength;
      return `${this.label(field)} must be at least ${length} characters`;
    }

    return '';
  }

  /* ===================== Factory ===================== */

  private createForm(): FormGroup<LoginForm> {
    return new FormGroup<LoginForm>({
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
    });
  }

  private label(field: keyof LoginForm): string {
    return field[0].toUpperCase() + field.slice(1);
  }
  navigateToSignUp(): void {
    this.router.navigate(['/auth/signup']);
  }
}
