import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BLOG_STATE_SERVICE } from '../../tokens/blog.tokens';
import { AUTH_SERVICE } from '../../../../core/tokens/service.tokens';
import { Comment } from '../../../../core/models/comment.model';
import { IBlogStateService } from '../../interfaces/blog-state-service.interface';
import { IAuthService } from '../../../../core/interfaces/auth-service.interface';
import { HlmButton } from '@shared/ui/button';
import { HlmCard, HlmCardContent } from '@shared/ui/card';
import { HlmSeparator } from '@shared/ui/separator';
import { CommonModule } from '@angular/common';
import { Loading } from '../../../../shared/components/loading/loading';

@Component({
  selector: 'app-blog-detail',
  imports: [CommonModule, HlmButton, HlmCard, HlmCardContent, HlmSeparator, Loading],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.css',
})
export class BlogDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly blogState: IBlogStateService = inject(BLOG_STATE_SERVICE);
  readonly authService: IAuthService = inject(AUTH_SERVICE);

  post = this.blogState.selectedPost;
  comments = this.blogState.allCommentsForPost;
  isLoading = this.blogState.isLoading;
  error = this.blogState.error;

  postId = signal<number>(0);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = Number(params['id']);
      this.postId.set(id);

      if (id) {
        this.blogState.loadPostById(id);
        this.blogState.loadComments(id);
      }
    });
  }

  onAddComment(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: `/blogs/${this.postId()}/add-comment` },
      });
    } else {
      this.router.navigate(['/blogs', this.postId(), 'add-comment']);
    }
  }

  trackByCommentId(index: number, comment: Comment): number {
    return comment.id;
  }

  goBack(): void {
    this.router.navigate(['/blogs']);
  }
}
