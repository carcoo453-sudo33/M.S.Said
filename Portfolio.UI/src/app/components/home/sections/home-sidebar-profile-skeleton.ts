import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home-sidebar-profile-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <aside class="md:sticky md:top-24 animate-pulse">
        <div class="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 space-y-8">
            <!-- Avatar -->
            <div class="flex justify-center">
                <div class="w-32 h-32 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
            </div>

            <!-- Name & Title -->
            <div class="text-center space-y-3">
                <div class="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-3/4 mx-auto"></div>
                <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3 mx-auto"></div>
            </div>

            <!-- Location & Availability -->
            <div class="space-y-3">
                <div class="flex items-center gap-3">
                    <div class="w-5 h-5 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                    <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded flex-1"></div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="w-5 h-5 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                    <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded flex-1"></div>
                </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <div *ngFor="let _ of [].constructor(3)" class="text-center space-y-2">
                    <div class="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-12 mx-auto"></div>
                    <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-16 mx-auto"></div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <div class="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full"></div>
                <div class="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full"></div>
            </div>

            <!-- Social Links -->
            <div class="flex justify-center gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <div *ngFor="let _ of [].constructor(4)" 
                     class="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
            </div>
        </div>
    </aside>
  `
})
export class HomeSidebarProfileSkeletonComponent { }
