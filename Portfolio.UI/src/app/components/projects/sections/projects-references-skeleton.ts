import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-projects-references-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="animate-pulse space-y-12">
        <!-- Section Title -->
        <div class="text-center space-y-4">
            <div class="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-72 mx-auto"></div>
            <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-96 mx-auto"></div>
        </div>

        <!-- Testimonials Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let _ of [].constructor(3)" 
                 class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">
                <!-- Quote Icon -->
                <div class="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
                
                <!-- Content -->
                <div class="space-y-3">
                    <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                    <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-11/12"></div>
                    <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-10/12"></div>
                </div>
                
                <!-- Author -->
                <div class="flex items-center gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <div class="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
                    <div class="flex-1 space-y-2">
                        <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-32"></div>
                        <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-24"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  `
})
export class ProjectsReferencesSkeletonComponent { }
