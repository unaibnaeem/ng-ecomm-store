import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;

  constructor() {}

  calculateTotalPages(totalItems: number) {
    this.totalPages = Math.ceil(totalItems / this.pageSize);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getPaginatedItems<T>(items: T[]): T[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return items.slice(startIndex, startIndex + this.pageSize);
  }
}
