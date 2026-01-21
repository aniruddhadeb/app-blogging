import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { HlmButton } from '@shared/ui/button';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule, HlmButton],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  @Input() set totalItems(value: number) {
    this._totalItems.set(value);
  }
  @Input() set itemsPerPage(value: number) {
    this._itemsPerPage.set(value);
  }
  @Input() set currentPage(value: number) {
    this._currentPage.set(value);
  }

  @Output() pageChange = new EventEmitter<number>();

  private _totalItems = signal(0);
  private _itemsPerPage = signal(5);
  private _currentPage = signal(1);

  totalPages = computed(() => Math.ceil(this._totalItems() / this._itemsPerPage()));

  pages = computed(() => {
    const total = this.totalPages();
    const current = this._currentPage();
    const pages: number[] = [];

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== -1) {
        pages.push(-1); // Ellipsis
      }
    }

    return pages;
  });

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this._currentPage()) {
      this._currentPage.set(page);
      this.pageChange.emit(page);
    }
  }

  previousPage(): void {
    this.goToPage(this._currentPage() - 1);
  }

  nextPage(): void {
    this.goToPage(this._currentPage() + 1);
  }

  isCurrentPage(page: number): boolean {
    return page === this._currentPage();
  }

  canGoPrevious(): boolean {
    return this._currentPage() > 1;
  }

  canGoNext(): boolean {
    return this._currentPage() < this.totalPages();
  }
}
