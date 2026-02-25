import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home-timeline-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="animate-pulse space-y-8">
        <!-- Section Header -->
        <div class="flex items-center justify-between">
            <div class="space-y-3">
                <div class="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-56"></div>
                <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-72"></div>
            </div>
            <div class="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-32"></div>
        </div>

        <!-- Timeline Items -->
        <div class="space-y-6">
            <div *ngFor="let _ of [].constructor(2)" 
                 class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
                <!-- Header -->
                <div class="flex items-start justify-between">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
                        <div class="space-y-2">
                            <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-48"></div>
                            <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-32"></div>
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
                    <div *ngFor="let _ of [].constructor(4)" 
                         class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full w-20"></div>
                </div>
            </div>
        </div>
    </section>
  `
})
export class HomeTimelineSkeletonComponent { }
