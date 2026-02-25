import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-projects-header-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="pt-32 pb-16 animate-pulse">
        <div class="space-y-12">
            <!-- Title and Subtitle -->
            <div class="space-y-6">
                <div class="h-16 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-2/3 mx-auto"></div>
                <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-1/2 mx-auto"></div>
            </div>

            <!-- Filter Tabs -->
            <div class="flex justify-center gap-4 flex-wrap">
                <div *ngFor="let _ of [].constructor(4)" 
                     class="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-full w-32"></div>
            </div>

            <!-- Stats -->
            <div class="flex justify-center gap-8">
                <div *ngFor="let _ of [].constructor(3)" class="text-center space-y-2">
                    <div class="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-20 mx-auto"></div>
                    <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-24 mx-auto"></div>
                </div>
            </div>
        </div>
    </section>
  `
})
export class ProjectsHeaderSkeletonComponent { }
