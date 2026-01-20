import { Injectable, signal, computed } from '@angular/core';
import { Blog } from '../../../core/models/blog.model';

@Injectable({ providedIn: 'root' })
export class BlogStore {
  private blogs = signal<Blog[]>([
    { id: '1', title: 'First Blog', content: 'Hello World', author: 'You', createdAt: new Date() }
  ]);

  selectedBlogId = signal<string | null>(null);

  readonly selectedBlog = computed(() =>
    this.blogs().find(b => b.id === this.selectedBlogId())
  );

  addBlog(blog: Blog) {
    this.blogs.update(list => [...list, blog]);
  }

  updateBlog(updated: Blog) {
    this.blogs.update(list =>
      list.map(b => (b.id === updated.id ? updated : b))
    );
  }

  deleteBlog(id: string) {
    this.blogs.update(list => list.filter(b => b.id !== id));
  }
}
