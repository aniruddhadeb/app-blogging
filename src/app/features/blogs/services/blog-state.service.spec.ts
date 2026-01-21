import { describe, it, beforeEach, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { BlogStateService } from './blog-state.service';
import { Post } from '../../../core/models/post.model';
import { Comment } from '../../../core/models/comment.model';
import { IBlogService } from '../interfaces/blog-service.interface';
import { MockStorageService } from '../../../testing/mocks/storage-service.mock';
import { BLOG_SERVICE } from '../tokens/blog.tokens';
import { STORAGE_SERVICE } from '../../../core/tokens/service.tokens';

class MockBlogApiService implements IBlogService {
  addComment(comment: Omit<Comment, 'id'>): Observable<Comment> {
    throw new Error('Method not implemented.');
  }
  getPosts = vi.fn();
  getPostById = vi.fn();
  getCommentsByPostId = vi.fn();
}

describe('BlogStateService', () => {
  let store: BlogStateService;
  let blogApiMock: MockBlogApiService;
  let storageMock: MockStorageService;

  beforeEach(() => {
    blogApiMock = new MockBlogApiService();
    storageMock = new MockStorageService();

    TestBed.configureTestingModule({
      providers: [
        BlogStateService,
        { provide: BLOG_SERVICE, useValue: blogApiMock },
        { provide: STORAGE_SERVICE, useValue: storageMock }
      ]
    });

    store = TestBed.inject(BlogStateService);
  });

  it('should initialize with empty state', () => {
    expect(store.posts()).toEqual([]);
    expect(store.selectedPost()).toBeNull();
    expect(store.comments()).toEqual([]);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should load posts successfully', () => {
    const posts: Post[] = [
      { id: 1, title: 'P1', body: 'B1', userId: 1 }
    ];

    blogApiMock.getPosts.mockReturnValue(of(posts));

    store.loadPosts();

    expect(store.posts()).toEqual(posts);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should handle loadPosts error', () => {
    blogApiMock.getPosts.mockReturnValue(
      throwError(() => new Error('API failed'))
    );

    store.loadPosts();

    expect(store.posts()).toEqual([]);
    expect(store.error()).toBe('API failed');
    expect(store.isLoading()).toBe(false);
  });

  it('should load post by id', () => {
    const post: Post = { id: 1, title: 'Post', body: 'Body', userId: 1 };

    blogApiMock.getPostById.mockReturnValue(of(post));

    store.loadPostById(1);

    expect(store.selectedPost()).toEqual(post);
  });

  it('should load comments', () => {
    const comments: Comment[] = [
      { id: 1, postId: 1, name: 'A', body: 'Nice', email: '' }
    ];

    blogApiMock.getCommentsByPostId.mockReturnValue(of(comments));

    store.loadComments(1);

    expect(store.comments()).toEqual(comments);
  });

  it('should add user comment and persist to storage', () => {
    const comment: Comment = {
      id: 100,
      postId: 1,
      name: 'User',
      body: 'My comment',
      email: ''
    };

    store.addUserComment(1, comment);

    const stored = storageMock.getItem<[number, Comment[]][]>('user_comments');
    expect(stored?.[0][1][0]).toEqual(comment);
  });

  it('should clear user comments', () => {
    store.clearUserComments();

    expect(storageMock.getItem('user_comments')).toBeNull();
  });

  it('should reset the store', () => {
    store.reset();

    expect(store.posts()).toEqual([]);
    expect(store.selectedPost()).toBeNull();
    expect(store.comments()).toEqual([]);
    expect(store.error()).toBeNull();
  });
});
