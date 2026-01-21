import { computed, inject, Injectable, signal } from '@angular/core';
import { Post } from '../../../core/models/post.model';
import { Comment } from '../../../core/models/comment.model';
import { IBlogStateService } from '../interfaces/blog-state-service.interface';
import { BLOG_SERVICE } from '../tokens/blog.tokens';
import { STORAGE_SERVICE } from '../../../core/tokens/service.tokens';
import { catchError, of, tap } from 'rxjs';
import { IBlogService } from '../interfaces/blog-service.interface';
import { IStorageService } from '../../../core/interfaces/storage-service.interface';

interface BlogState {
  posts: Post[];
  selectedPost: Post | null;
  comments: Comment[];
  userComments: Map<number, Comment[]>;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})

export class BlogStateService implements IBlogStateService {
  private readonly blogService: IBlogService = inject(BLOG_SERVICE);
  private readonly storageService: IStorageService = inject(STORAGE_SERVICE);

  // Private state signals
  private readonly state = signal<BlogState>({
    posts: [],
    selectedPost: null,
    comments: [],
    userComments: new Map(),
    isLoading: false,
    error: null
  });

  // Public readonly signals
  readonly posts = computed(() => this.state().posts);
  readonly selectedPost = computed(() => this.state().selectedPost);
  readonly comments = computed(() => this.state().comments);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly error = computed(() => this.state().error);

  // Computed signal for all comments (user + API)
  readonly allCommentsForPost = computed(() => {
    const postId = this.state().selectedPost?.id;
    if (!postId) return [];
    
    const userComments = this.state().userComments.get(postId) || [];
    return [...userComments, ...this.state().comments];
  });

  constructor() {
    // Load user comments on initialization
    this.loadUserComments();
  }

  // Update state helper
  private updateState(partial: Partial<BlogState>): void {
    this.state.update(current => ({ ...current, ...partial }));
  }

  // Load all posts
  loadPosts(): void {
    this.updateState({ isLoading: true, error: null });

    this.blogService.getPosts()
      .pipe(
        tap(posts => this.updateState({ posts, isLoading: false })),
        catchError(error => {
          this.updateState({ 
            error: error.message || 'Failed to load posts', 
            isLoading: false 
          });
          return of([]);
        })
      )
      .subscribe();
  }

  // Load single post by ID
  loadPostById(id: number): void {
    this.updateState({ isLoading: true, error: null });

    this.blogService.getPostById(id)
      .pipe(
        tap(post => this.updateState({ selectedPost: post, isLoading: false })),
        catchError(error => {
          this.updateState({ 
            error: error.message || 'Failed to load post', 
            isLoading: false 
          });
          return of(null);
        })
      )
      .subscribe();
  }

  // Load comments for a post
  loadComments(postId: number): void {
    this.updateState({ isLoading: true, error: null });

    this.blogService.getCommentsByPostId(postId)
      .pipe(
        tap(comments => {
          this.updateState({ comments, isLoading: false });
          this.loadUserComments(); // Reload user comments to sync
        }),
        catchError(error => {
          this.updateState({ 
            error: error.message || 'Failed to load comments', 
            isLoading: false 
          });
          return of([]);
        })
      )
      .subscribe();
  }

  // Add user comment
  addUserComment(postId: number, comment: Comment): void {
    const currentState = this.state();
    const currentMap = new Map(currentState.userComments);
    const existingComments = currentMap.get(postId) || [];
    
    // Add new comment at the beginning
    currentMap.set(postId, [comment, ...existingComments]);
    
    this.updateState({ userComments: currentMap });
    
    // Persist to localStorage
    this.storageService.setItem('user_comments', Array.from(currentMap.entries()));
  }

  // Load user comments from localStorage
  loadUserComments(): void {
    const savedComments = this.storageService.getItem<[number, Comment[]][]>('user_comments');
    if (savedComments) {
      this.updateState({ userComments: new Map(savedComments) });
    }
  }

  // Clear user comments
  clearUserComments(): void {
    this.updateState({ userComments: new Map() });
    this.storageService.removeItem('user_comments');
  }

  // Reset state
  reset(): void {
    this.state.set({
      posts: [],
      selectedPost: null,
      comments: [],
      userComments: new Map(),
      isLoading: false,
      error: null
    });
  }
}
