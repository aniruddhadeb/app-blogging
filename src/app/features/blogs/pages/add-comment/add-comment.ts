import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBlogStateService } from '../../interfaces/blog-state-service.interface';
import { BLOG_STATE_SERVICE } from '../../tokens/blog.tokens';
import { IAuthService } from '../../../../core/interfaces/auth-service.interface';
import { AUTH_SERVICE } from '../../../../core/tokens/service.tokens';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comment } from '../../../../core/models/comment.model';
import { CommonModule } from '@angular/common';
import { HlmButton } from '@shared/ui/button';
import { HlmError, HlmFormField, HlmHint } from '@shared/ui/form-field';
import { HlmTextarea } from '@shared/ui/textarea';
import { HlmLabel } from '@shared/ui/label';
import { HlmInput } from '@shared/ui/input';

export interface AddCommentForm {
  name: FormControl<string>;
  email: FormControl<string>;
  body: FormControl<string>;
}

@Component({
  selector: 'app-add-comment',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HlmButton,
    HlmFormField,
    HlmTextarea,
    HlmHint,
    HlmError,
    HlmLabel,
    HlmInput,
  ],
  templateUrl: './add-comment.html',
  styleUrl: './add-comment.css',
})
export class AddComment {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly blogState: IBlogStateService = inject(BLOG_STATE_SERVICE);
  private readonly authService: IAuthService = inject(AUTH_SERVICE);

  /**  Signals */
  readonly postId = signal<number>(0);
  readonly isSubmitting = signal<boolean>(false);

  /** Strongly typed reactive form */
  private readonly _form = signal<FormGroup<AddCommentForm>>(this.createForm());

  /** Angular-compatible accessor */
  get commentForm(): FormGroup<AddCommentForm> {
    return this._form();
  }

  /**  Signal-driven derived state */
  readonly isFormInvalid = computed(() => this.commentForm.invalid);

  ngOnInit(): void {
    this.route.params.subscribe((params) => this.postId.set(Number(params['id']) || 0));
  }

  onSubmit(): void {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const value = this.commentForm.getRawValue();

    const comment: Comment = {
      id: Date.now(),
      postId: this.postId(),
      name: value.name,
      email: value.email,
      body: value.body,
      isUserAdded: true,
    };

    this.blogState.addUserComment(this.postId(), comment);

    setTimeout(() => {
      this.router.navigate(['/blogs', this.postId()]);
    }, 500);
  }

  onCancel(): void {
    this.router.navigate(['/blogs', this.postId()]);
  }

  hasFieldError(field: keyof AddCommentForm): boolean {
    const control = this.commentForm.controls[field];
    return control.invalid && control.touched;
  }

  getFieldError(field: keyof AddCommentForm): string {
    const control = this.commentForm.controls[field];
    if (!control.touched) return '';

    if (control.hasError('required')) {
      return `${this.label(field)} is required`;
    }

    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (control.hasError('minlength')) {
      return `${this.label(field)} must be at least ${
        control.getError('minlength')!.requiredLength
      } characters`;
    }

    return '';
  }

  private createForm(): FormGroup<AddCommentForm> {
    const user = this.authService.currentUser();

    return new FormGroup<AddCommentForm>({
      name: new FormControl(user ? `${user.firstName} ${user.lastName}` : '', {
        nonNullable: true,
        validators: Validators.required,
      }),
      email: new FormControl(user?.username ? `${user.username}@example.com` : '', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      body: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(10)],
      }),
    });
  }

  private label(field: keyof AddCommentForm): string {
    return field === 'body' ? 'Comment' : field[0].toUpperCase() + field.slice(1);
  }
}
