import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-blog-platform-filter-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 animate-pulse">
        <!-- Title -->
        <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-1/2 mb-6"></div>
        
        <!-- Filter Buttons -->
        <div class="space-y-3">
            <div *ngFor="let _ of [].constructor(6)" 
                 class="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full"></div>
        </div>
    </div>
  `
})
export class BlogPlatformFilterSkeletonComponent { }
