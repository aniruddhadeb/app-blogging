import { signal, computed } from '@angular/core';
import { IBlogStateService } from '../../features/blogs/interfaces/blog-state-service.interface';
import { Post } from '../../core/models/post.model';
import { Comment } from '../../core/models/comment.model';

export class MockBlogStateService implements IBlogStateService {
  private _posts = signal<Post[]>([]);
  private _selectedPost = signal<Post | null>(null);
  private _comments = signal<Comment[]>([]);
  private _userComments = signal<Map<number, Comment[]>>(new Map());
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  posts = this._posts.asReadonly();
  selectedPost = this._selectedPost.asReadonly();
  comments = this._comments.asReadonly();
  isLoading = this._isLoading.asReadonly();
  error = this._error.asReadonly();

  allCommentsForPost = computed(() => {
    const postId = this._selectedPost()?.id;
    if (!postId) return [];
    const userComments = this._userComments().get(postId) || [];
    return [...userComments, ...this._comments()];
  });

  loadPosts(): void {
    this._isLoading.set(true);
    // Simulate async operation
    setTimeout(() => {
      this._posts.set([
        { id: 1, userId: 1, title: 'Test Post 1', body: 'Test body 1' },
        { id: 2, userId: 1, title: 'Test Post 2', body: 'Test body 2' }
      ]);
      this._isLoading.set(false);
    }, 0);
  }

  loadPostById(id: number): void {
    this._isLoading.set(true);
    setTimeout(() => {
      this._selectedPost.set({ id, userId: 1, title: `Test Post ${id}`, body: `Test body ${id}` });
      this._isLoading.set(false);
    }, 0);
  }

  loadComments(postId: number): void {
    this._isLoading.set(true);
    setTimeout(() => {
      this._comments.set([
        { id: 1, postId, name: 'John', email: 'john@test.com', body: 'Test comment' }
      ]);
      this._isLoading.set(false);
    }, 0);
  }

  addUserComment(postId: number, comment: Comment): void {
    const currentMap = new Map(this._userComments());
    const existing = currentMap.get(postId) || [];
    currentMap.set(postId, [comment, ...existing]);
    this._userComments.set(currentMap);
  }

  loadUserComments(): void {
    // Mock implementation
  }

  clearUserComments(): void {
    this._userComments.set(new Map());
  }

  reset(): void {
    this._posts.set([]);
    this._selectedPost.set(null);
    this._comments.set([]);
    this._userComments.set(new Map());
    this._isLoading.set(false);
    this._error.set(null);
  }

  // Helpers for tests
  setPosts(posts: Post[]): void {
    this._posts.set(posts);
  }

  setError(error: string): void {
    this._error.set(error);
  }
}
