import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home-featured-projects-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="animate-pulse space-y-8">
        <!-- Section Header -->
        <div class="flex items-center justify-between">
            <div class="space-y-3">
                <div class="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-64"></div>
                <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-80"></div>
            </div>
            <div class="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-32"></div>
        </div>

        <!-- Projects Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div *ngFor="let _ of [].constructor(4)" 
                 class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <!-- Image -->
                <div class="aspect-video bg-zinc-200 dark:bg-zinc-800"></div>
                
                <!-- Content -->
                <div class="p-6 space-y-4">
                    <!-- Category -->
                    <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full w-24"></div>
                    
                    <!-- Title -->
                    <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                    
                    <!-- Description -->
                    <div class="space-y-2">
                        <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                        <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                        <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-24"></div>
                        <div class="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-28"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  `
})
export class HomeFeaturedProjectsSkeletonComponent { }
