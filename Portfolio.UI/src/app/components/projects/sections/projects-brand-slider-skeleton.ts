import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-projects-brand-slider-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="animate-pulse space-y-12">
        <!-- Section Title -->
        <div class="text-center space-y-4">
            <div class="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-80 mx-auto"></div>
            <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-96 mx-auto"></div>
        </div>

        <!-- Brand Logos Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <div *ngFor="let _ of [].constructor(12)" 
                 class="aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
        </div>
    </section>
  `
})
export class ProjectsBrandSliderSkeletonComponent { }
