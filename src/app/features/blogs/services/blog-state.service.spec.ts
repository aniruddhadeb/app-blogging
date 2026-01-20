import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Post } from '../../../core/models/post.model';
import { Comment } from '../../../core/models/comment.model';
import { BLOG_SERVICE } from '../tokens/blog.tokens';
import { STORAGE_SERVICE } from '../../../core/tokens/service.tokens';
import { BlogStateService } from './blog-state.service';

describe('BlogStateService', () => {
  let store: BlogStateService;
  let blogServiceSpy: jasmine.SpyObj<any>;
  let storageServiceSpy: jasmine.SpyObj<any>;

  const mockPosts: Post[] = [
    {
      id: 1, title: 'Post 1', body: 'Body 1',
      userId: 0
    },
    {
      id: 2, title: 'Post 2', body: 'Body 2',
      userId: 0
    }
  ];

  const mockPost: Post = {
    id: 1, title: 'Post 1', body: 'Body 1',
    userId: 0
  };

  const mockComments: Comment[] = [
    {
      id: 1, postId: 1, name: 'A', body: 'Nice post',
      email: ''
    }
  ];

  beforeEach(() => {
    blogServiceSpy = jasmine.createSpyObj('BlogService', [
      'getPosts',
      'getPostById',
      'getCommentsByPostId'
    ]);

    storageServiceSpy = jasmine.createSpyObj('StorageService', [
      'getItem',
      'setItem',
      'removeItem'
    ]);

    TestBed.configureTestingModule({
      providers: [
        BlogStateService,
        { provide: BLOG_SERVICE, useValue: blogServiceSpy },
        { provide: STORAGE_SERVICE, useValue: storageServiceSpy }
      ]
    });

    store = TestBed.inject(BlogStateService);
  });

  it('should be created with initial state', () => {
    expect(store.posts()).toEqual([]);
    expect(store.selectedPost()).toBeNull();
    expect(store.comments()).toEqual([]);
    expect(store.isLoading()).toBeFalse();
    expect(store.error()).toBeNull();
  });

  it('should load posts successfully', () => {
    blogServiceSpy.getPosts.and.returnValue(of(mockPosts));

    store.loadPosts();

    expect(store.isLoading()).toBeFalse();
    expect(store.posts()).toEqual(mockPosts);
    expect(store.error()).toBeNull();
  });

  it('should handle error while loading posts', () => {
    blogServiceSpy.getPosts.and.returnValue(
      throwError(() => new Error('API failed'))
    );

    store.loadPosts();

    expect(store.posts()).toEqual([]);
    expect(store.isLoading()).toBeFalse();
    expect(store.error()).toBe('API failed');
  });

  it('should load post by id successfully', () => {
    blogServiceSpy.getPostById.and.returnValue(of(mockPost));

    store.loadPostById(1);

    expect(store.selectedPost()).toEqual(mockPost);
    expect(store.isLoading()).toBeFalse();
  });

  it('should handle error while loading post by id', () => {
    blogServiceSpy.getPostById.and.returnValue(
      throwError(() => new Error('Post not found'))
    );

    store.loadPostById(99);

    expect(store.selectedPost()).toBeNull();
    expect(store.error()).toBe('Post not found');
  });

  it('should load comments for a post', () => {
    blogServiceSpy.getCommentsByPostId.and.returnValue(of(mockComments));
    storageServiceSpy.getItem.and.returnValue(null);

    store.loadComments(1);

    expect(store.comments()).toEqual(mockComments);
    expect(store.isLoading()).toBeFalse();
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

    expect(storageServiceSpy.setItem).toHaveBeenCalled();
  });

  it('should compute allCommentsForPost correctly', () => {
    blogServiceSpy.getPostById.and.returnValue(of(mockPost));
    blogServiceSpy.getCommentsByPostId.and.returnValue(of(mockComments));

    store.loadPostById(1);
    store.loadComments(1);

    const userComment: Comment = {
      id: 200,
      postId: 1,
      name: 'User',
      body: 'Extra',
      email: ''
    };

    store.addUserComment(1, userComment);

    const allComments = store.allCommentsForPost();

    expect(allComments.length).toBe(2);
    expect(allComments[0]).toEqual(userComment);
  });

  it('should load user comments from storage', () => {
    const stored = [
      [1, [{ id: 10, postId: 1, name: 'Saved', body: 'Stored comment' }]]
    ];

    storageServiceSpy.getItem.and.returnValue(stored);

    store.loadUserComments();

    store.loadPostById(1);
    const comments = store.allCommentsForPost();

    expect(comments.length).toBe(1);
    expect(comments[0].name).toBe('Saved');
  });

  it('should clear user comments', () => {
    store.clearUserComments();

    expect(storageServiceSpy.removeItem).toHaveBeenCalledWith('user_comments');
  });

  it('should reset the store state', () => {
    store.reset();

    expect(store.posts()).toEqual([]);
    expect(store.selectedPost()).toBeNull();
    expect(store.comments()).toEqual([]);
    expect(store.isLoading()).toBeFalse();
    expect(store.error()).toBeNull();
  });
});
