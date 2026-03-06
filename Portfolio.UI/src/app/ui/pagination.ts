import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-angular';

@Component({
  selector: 'ui-pagination',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <nav [class]="paginationClasses" role="navigation" aria-label="pagination">
      <ul class="flex items-center gap-1">
        <!-- Previous Button -->
        <li>
          <button
            [disabled]="currentPage <= 1"
            (click)="goToPage(currentPage - 1)"
            [class]="getButtonClasses(false, currentPage <= 1)"
            aria-label="Go to previous page">
            <lucide-icon [img]="ChevronLeftIcon" class="h-4 w-4"></lucide-icon>
            <span class="sr-only">Previous</span>
          </button>
        </li>

        <!-- Page Numbers -->
        <li *ngFor="let page of visiblePages; trackBy: trackByFn">
          <button
            *ngIf="page !== '...'; else ellipsis"
            [disabled]="page === currentPage"
            (click)="goToPage(page)"
            [class]="getButtonClasses(page === currentPage)"
            [attr.aria-label]="'Go to page ' + page"
            [attr.aria-current]="page === currentPage ? 'page' : null">
            {{ page }}
          </button>
          <ng-template #ellipsis>
            <span class="flex h-9 w-9 items-center justify-center">
              <lucide-icon [img]="MoreHorizontalIcon" class="h-4 w-4"></lucide-icon>
              <span class="sr-only">More pages</span>
            </span>
          </ng-template>
        </li>

        <!-- Next Button -->
        <li>
          <button
            [disabled]="currentPage >= totalPages"
            (click)="goToPage(currentPage + 1)"
            [class]="getButtonClasses(false, currentPage >= totalPages)"
            aria-label="Go to next page">
            <lucide-icon [img]="ChevronRightIcon" class="h-4 w-4"></lucide-icon>
            <span class="sr-only">Next</span>
          </button>
        </li>
      </ul>
    </nav>
  `
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() showFirstLast = true;
  @Input() siblingCount = 1;
  @Input() className = '';
  @Output() pageChange = new EventEmitter<number>();

  ChevronLeftIcon = ChevronLeft;
  ChevronRightIcon = ChevronRight;
  MoreHorizontalIcon = MoreHorizontal;

  get paginationClasses(): string {
    return `mx-auto flex w-full justify-center ${this.className}`;
  }

  get visiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const totalPages = this.totalPages;
    const current = this.currentPage;
    const siblings = this.siblingCount;

    if (totalPages <= 7) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination logic
      const leftSibling = Math.max(current - siblings, 1);
      const rightSibling = Math.min(current + siblings, totalPages);

      const showLeftEllipsis = leftSibling > 2;
      const showRightEllipsis = rightSibling < totalPages - 1;

      if (this.showFirstLast) {
        pages.push(1);
      }

      if (showLeftEllipsis) {
        pages.push('...');
      }

      for (let i = leftSibling; i <= rightSibling; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (showRightEllipsis) {
        pages.push('...');
      }

      if (this.showFirstLast && totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  getButtonClasses(isActive = false, isDisabled = false): string {
    const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-9 w-9';
    
    if (isDisabled) {
      return `${baseClasses} pointer-events-none opacity-50`;
    }
    
    if (isActive) {
      return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90`;
    }
    
    return `${baseClasses} hover:bg-accent hover:text-accent-foreground`;
  }

  trackByFn(index: number, page: number | string): string {
    return `${index}-${page}`;
  }
}