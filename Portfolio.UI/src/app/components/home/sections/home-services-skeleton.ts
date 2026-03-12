import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home-services-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="animate-pulse space-y-8">
        <!-- Section Title -->
        <div class="space-y-3">
            <div class="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-64"></div>
            <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-96"></div>
        </div>

        <!-- Services Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div *ngFor="let _ of [].constructor(4)" 
                 class="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
                <!-- Icon -->
                <div class="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
                
                <!-- Title -->
                <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                
                <!-- Description -->
                <div class="space-y-2">
                    <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                    <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
                </div>

                <!-- Tags -->
                <div class="flex gap-2 flex-wrap pt-2">
                    <div *ngFor="let _ of [].constructor(3)" 
                         class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full w-16"></div>
                </div>
            </div>
        </div>
    </section>
  `
})
export class HomeServicesSkeletonComponent { }
