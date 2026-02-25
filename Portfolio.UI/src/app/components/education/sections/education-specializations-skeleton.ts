import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-education-specializations-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="animate-pulse space-y-8">
        <!-- Section Title -->
        <div class="text-center space-y-4">
            <div class="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-64 mx-auto"></div>
            <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-96 mx-auto"></div>
        </div>

        <!-- Specializations Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let _ of [].constructor(6)" 
                 class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
                <!-- Icon -->
                <div class="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
                
                <!-- Title -->
                <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                
                <!-- Description -->
                <div class="space-y-2">
                    <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                    <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
                </div>

                <!-- Progress Bar -->
                <div class="space-y-2">
                    <div class="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full w-full"></div>
                </div>
            </div>
        </div>
    </section>
  `
})
export class EducationSpecializationsSkeletonComponent { }
