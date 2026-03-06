import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ChevronRight, MoreHorizontal } from 'lucide-angular';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

@Component({
  selector: 'ui-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <nav [class]="breadcrumbClasses" aria-label="breadcrumb">
      <ol class="flex items-center space-x-1 md:space-x-3">
        <li *ngFor="let item of items; let i = index; trackBy: trackByFn" class="flex items-center">
          <!-- Separator -->
          <lucide-icon 
            *ngIf="i > 0" 
            [img]="ChevronRightIcon" 
            class="mx-2 h-4 w-4 text-muted-foreground">
          </lucide-icon>
          
          <!-- Item -->
          <div [class]="getItemClasses(item)">
            <a 
              *ngIf="item.href && !item.current; else textOnly"
              [routerLink]="item.href"
              class="hover:text-foreground transition-colors">
              {{ item.label }}
            </a>
            <ng-template #textOnly>
              <span [attr.aria-current]="item.current ? 'page' : null">
                {{ item.label }}
              </span>
            </ng-template>
          </div>
        </li>
      </ol>
    </nav>
  `
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
  @Input() className = '';
  @Input() separator?: any;

  ChevronRightIcon = ChevronRight;
  MoreHorizontalIcon = MoreHorizontal;

  get breadcrumbClasses(): string {
    return `${this.className}`;
  }

  getItemClasses(item: BreadcrumbItem): string {
    const baseClasses = 'text-sm font-medium';
    return item.current 
      ? `${baseClasses} text-foreground` 
      : `${baseClasses} text-muted-foreground`;
  }

  trackByFn(index: number, item: BreadcrumbItem): string {
    return `${index}-${item.label}`;
  }
}