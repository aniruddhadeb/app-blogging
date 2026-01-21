import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Loading } from '../../../../shared/components/loading/loading';
import { BLOG_STATE_SERVICE } from '../../tokens/blog.tokens';
import { Post } from '../../../../core/models/post.model';

@Component({
  selector: 'app-blog-list',
  imports: [CommonModule, RouterLink, Pagination, Loading],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.css',
})
export class BlogList {
private readonly blogState = inject(BLOG_STATE_SERVICE);

  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(5);

  posts = this.blogState.posts;
  isLoading = this.blogState.isLoading;
  error = this.blogState.error;

  paginatedPosts = computed(() => {
    const allPosts = this.posts();
    const page = this.currentPage();
    const perPage = this.itemsPerPage();
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    
    return allPosts.slice(startIndex, endIndex);
  });

  totalPosts = computed(() => this.posts().length);

  ngOnInit(): void {
    this.blogState.loadPosts();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  trackByPostId(index: number, post: Post): number {
    return post.id;
  }
}
