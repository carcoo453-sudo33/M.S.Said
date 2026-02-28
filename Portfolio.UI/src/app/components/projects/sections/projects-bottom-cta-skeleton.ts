import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-projects-bottom-cta-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="animate-pulse">
        <div class="bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 md:p-16 text-center space-y-8">
            <!-- Icon -->
            <div class="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-xl mx-auto"></div>
            
            <!-- Title -->
            <div class="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-96 mx-auto"></div>
            
            <!-- Description -->
            <div class="space-y-2 max-w-2xl mx-auto">
                <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full"></div>
                <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-5/6 mx-auto"></div>
            </div>
            
            <!-- Buttons -->
            <div class="flex justify-center gap-4 pt-4">
                <div class="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-40"></div>
                <div class="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-40"></div>
            </div>
        </div>
    </section>
  `
})
export class ProjectsBottomCTASkeletonComponent { }
