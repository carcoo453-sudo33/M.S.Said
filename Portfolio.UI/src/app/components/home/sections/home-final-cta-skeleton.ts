import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home-final-cta-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="max-w-7xl mx-auto px-6 pb-24 animate-pulse">
        <div class="bg-gradient-to-br from-zinc-100/40 to-zinc-50/40 dark:from-zinc-900/40 dark:to-zinc-950/40 backdrop-blur-md rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 md:p-16">
            <div class="max-w-3xl mx-auto text-center space-y-8">
                <!-- Icon -->
                <div class="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-xl mx-auto"></div>
                
                <!-- Title -->
                <div class="space-y-4">
                    <div class="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-3/4 mx-auto"></div>
                    <div class="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-2/3 mx-auto"></div>
                </div>
                
                <!-- Description -->
                <div class="space-y-3">
                    <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                    <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6 mx-auto"></div>
                </div>
                
                <!-- Buttons -->
                <div class="flex justify-center gap-4 pt-4">
                    <div class="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-40"></div>
                    <div class="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-40"></div>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-3 gap-6 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                    <div *ngFor="let _ of [].constructor(3)" class="space-y-2">
                        <div class="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-16 mx-auto"></div>
                        <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-24 mx-auto"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  `
})
export class HomeFinalCTASkeletonComponent { }
