import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home-brief-bio-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="animate-pulse space-y-8">
        <!-- Badge -->
        <div class="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full w-48"></div>

        <!-- Title -->
        <div class="space-y-4">
            <div class="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full"></div>
            <div class="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-5/6"></div>
        </div>

        <!-- Description -->
        <div class="space-y-3">
            <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
            <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-11/12"></div>
            <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-10/12"></div>
            <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-9/12"></div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 pt-4">
            <div class="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-40"></div>
            <div class="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-40"></div>
        </div>

        <!-- Highlights -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
            <div *ngFor="let _ of [].constructor(4)" class="space-y-2">
                <div class="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-16"></div>
                <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-24"></div>
            </div>
        </div>
    </section>
  `
})
export class HomeBriefBioSkeletonComponent { }
