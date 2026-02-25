import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-education-timeline-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6 animate-pulse">
        <div *ngFor="let _ of [].constructor(3)" 
             class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
            <!-- Header -->
            <div class="flex items-start justify-between">
                <div class="flex items-center gap-4 flex-1">
                    <div class="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl shrink-0"></div>
                    <div class="flex-1 space-y-2">
                        <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                        <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
                    </div>
                </div>
                <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full w-24"></div>
            </div>

            <!-- Description -->
            <div class="space-y-2">
                <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-11/12"></div>
                <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-10/12"></div>
            </div>

            <!-- Tags -->
            <div class="flex gap-2 flex-wrap">
                <div *ngFor="let _ of [].constructor(3)" 
                     class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full w-20"></div>
            </div>
        </div>
    </div>
  `
})
export class EducationTimelineSkeletonComponent { }
