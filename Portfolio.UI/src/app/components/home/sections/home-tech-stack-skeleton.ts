import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home-tech-stack-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="animate-pulse space-y-8">
        <!-- Section Title -->
        <div class="space-y-3">
            <div class="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-56"></div>
            <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-80"></div>
        </div>

        <!-- Tech Categories -->
        <div class="space-y-6">
            <div *ngFor="let _ of [].constructor(3)" class="space-y-4">
                <!-- Category Title -->
                <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-40"></div>
                
                <!-- Skills Grid -->
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div *ngFor="let _ of [].constructor(4)" 
                         class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-3">
                        <!-- Icon -->
                        <div class="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                        
                        <!-- Name -->
                        <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-20"></div>
                        
                        <!-- Level Bar -->
                        <div class="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full w-full"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  `
})
export class HomeTechStackSkeletonComponent { }
