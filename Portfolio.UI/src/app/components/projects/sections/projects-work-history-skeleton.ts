import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-projects-work-history-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="animate-pulse space-y-12">
        <!-- Section Title -->
        <div class="text-center space-y-4">
            <div class="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-64 mx-auto"></div>
            <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-96 mx-auto"></div>
        </div>

        <!-- Timeline -->
        <div class="max-w-4xl mx-auto space-y-8">
            <div *ngFor="let _ of [].constructor(4)" class="flex gap-6">
                <!-- Timeline Dot -->
                <div class="flex flex-col items-center">
                    <div class="w-4 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
                    <div class="w-0.5 h-full bg-zinc-200 dark:bg-zinc-800"></div>
                </div>
                
                <!-- Content -->
                <div class="flex-1 pb-8 space-y-3">
                    <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-48"></div>
                    <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-64"></div>
                    <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-32"></div>
                    <div class="space-y-2 pt-2">
                        <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                        <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  `
})
export class ProjectsWorkHistorySkeletonComponent { }
