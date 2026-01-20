import { Observable } from "rxjs";
import { Post } from "../../../core/models/post.model";
import { Comment } from "../../../core/models/comment.model";

export interface IBlogService {
  getPosts(): Observable<Post[]>;
  getPostById(id: number): Observable<Post>;
  getCommentsByPostId(postId: number): Observable<Comment[]>;
  addComment(comment: Omit<Comment, 'id'>): Observable<Comment>;
}