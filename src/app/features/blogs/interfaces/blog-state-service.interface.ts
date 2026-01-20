import { Signal } from "@angular/core";
import { Post } from "../../../core/models/post.model";
import { Comment } from "../../../core/models/comment.model";

export interface IBlogStateService {
  posts: Signal<Post[]>;
  selectedPost: Signal<Post | null>;
  comments: Signal<Comment[]>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  allCommentsForPost: Signal<Comment[]>;
  loadPosts(): void;
  loadPostById(id: number): void;
  loadComments(postId: number): void;
  addUserComment(postId: number, comment: Comment): void;
  loadUserComments(): void;
  clearUserComments(): void;
  reset(): void;
}