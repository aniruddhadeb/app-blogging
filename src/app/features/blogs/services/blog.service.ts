import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../../core/models/post.model';
import { Comment } from '../../../core/models/comment.model';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL, COMMENTS_API_URL, POSTS_API_URL } from '../../../shared/tokens/api.tokens';
import { IBlogService } from '../interfaces/blog-service.interface';

@Injectable({
  providedIn: 'root',
})
export class BlogService implements IBlogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly postsUrl = inject(POSTS_API_URL);
  private readonly commentsUrl = inject(COMMENTS_API_URL);

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}${this.postsUrl}`);
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}${this.postsUrl}/${id}`);
  }

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}${this.postsUrl}/${postId}${this.commentsUrl}`);
  }

  addComment(comment: Omit<Comment, 'id'>): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}${this.commentsUrl}`, comment);
  }
}
