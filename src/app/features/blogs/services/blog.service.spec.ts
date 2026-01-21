import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { BlogService } from './blog.service';
import { API_BASE_URL, POSTS_API_URL, COMMENTS_API_URL } from '../../../shared/tokens/api.tokens';
import { Post } from '../../../core/models/post.model';
import { Comment } from '../../../core/models/comment.model';

describe('BlogService', () => {
  let service: BlogService;
  let httpMock: HttpTestingController;

  const BASE_URL = 'https://api.test.com';
  const POSTS_URL = '/posts';
  const COMMENTS_URL = '/comments';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BlogService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
        { provide: POSTS_API_URL, useValue: POSTS_URL },
        { provide: COMMENTS_API_URL, useValue: COMMENTS_URL },
      ],
    });

    service = TestBed.inject(BlogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch posts', () => {
    const mockPosts: Post[] = [{ id: 1, userId: 1, title: 'Post 1', body: 'Body 1' }];

    service.getPosts().subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${BASE_URL}${POSTS_URL}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockPosts);
  });

  it('should fetch post by id', () => {
    const mockPost: Post = {
      id: 1,
      userId: 1,
      title: 'Post 1',
      body: 'Body 1',
    };

    service.getPostById(1).subscribe((post) => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${BASE_URL}${POSTS_URL}/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockPost);
  });

  it('should fetch comments for a post', () => {
    const mockComments: Comment[] = [
      {
        id: 1,
        postId: 1,
        name: 'John',
        email: 'john@test.com',
        body: 'Nice post',
      },
    ];

    service.getCommentsByPostId(1).subscribe((comments) => {
      expect(comments).toEqual(mockComments);
    });

    const req = httpMock.expectOne(`${BASE_URL}${POSTS_URL}/1${COMMENTS_URL}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockComments);
  });

  it('should add a comment', () => {
    const newComment: Omit<Comment, 'id'> = {
      postId: 1,
      name: 'User',
      email: 'user@test.com',
      body: 'My comment',
    };

    const savedComment: Comment = {
      id: 100,
      ...newComment,
    };

    service.addComment(newComment).subscribe((comment) => {
      expect(comment).toEqual(savedComment);
    });

    const req = httpMock.expectOne(`${BASE_URL}${COMMENTS_URL}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newComment);

    req.flush(savedComment);
  });
});
