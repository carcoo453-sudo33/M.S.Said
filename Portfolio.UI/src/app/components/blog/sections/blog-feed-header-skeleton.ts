import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-blog-feed-header-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex items-center justify-between animate-pulse">
        <!-- Title -->
        <div class="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-48"></div>
        
        <!-- View Toggle Buttons -->
        <div class="flex items-center gap-2">
            <div class="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800"></div>
            <div class="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800"></div>
        </div>
    </div>
  `
})
export class BlogFeedHeaderSkeletonComponent { }
