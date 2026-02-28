import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-projects-grid-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="animate-pulse">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let _ of [].constructor(6)" 
                 class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <!-- Image -->
                <div class="aspect-video bg-zinc-200 dark:bg-zinc-800"></div>
                
                <!-- Content -->
                <div class="p-6 space-y-4">
                    <!-- Category Badge -->
                    <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full w-24"></div>
                    
                    <!-- Title -->
                    <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                    
                    <!-- Description -->
                    <div class="space-y-2">
                        <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                        <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
                    </div>
                    
                    <!-- Tech Stack -->
                    <div class="flex gap-2 flex-wrap">
                        <div *ngFor="let _ of [].constructor(3)" 
                             class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-md w-16"></div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                        <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-20"></div>
                        <div class="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-32"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  `
})
export class ProjectsGridSkeletonComponent { }
