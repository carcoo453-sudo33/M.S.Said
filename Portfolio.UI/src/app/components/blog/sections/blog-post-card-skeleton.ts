import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-blog-post-card-skeleton',
    standalone: true,
    imports: [CommonModule],
    host: {
        'class': 'flex h-full'
    },
    template: `
    <article class="w-full bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-pulse h-full flex flex-col">
        <!-- Card Header -->
        <div class="p-8 flex items-start justify-between">
            <div class="flex items-center gap-4 flex-1">
                <div class="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800"></div>
                <div class="flex-1 space-y-2">
                    <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-3/4"></div>
                    <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-1/2"></div>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-9 h-9 rounded-lg bg-zinc-200 dark:bg-zinc-800"></div>
            </div>
        </div>

        <!-- Card Content -->
        <div class="px-8 pb-8 space-y-6 flex-1">
            <!-- Summary Lines -->
            <div class="space-y-2">
                <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full"></div>
                <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-11/12"></div>
                <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-10/12"></div>
                <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-9/12"></div>
            </div>

            <!-- Image Placeholder -->
            <div class="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2">
                <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-md w-16"></div>
                <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-md w-20"></div>
                <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-md w-14"></div>
            </div>
        </div>

        <!-- Card Footer -->
        <div class="px-8 py-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div class="flex items-center gap-6">
                <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-16"></div>
                <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-20"></div>
                <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-16"></div>
            </div>
            <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-24"></div>
        </div>
    </article>
  `
})
export class BlogPostCardSkeletonComponent {
    @Input() delay: string = '0s';
}
