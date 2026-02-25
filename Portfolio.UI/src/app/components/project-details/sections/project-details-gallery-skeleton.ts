import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-project-details-gallery-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="animate-pulse space-y-6">
        <!-- Main Image -->
        <div class="aspect-video bg-zinc-800 rounded-2xl w-full"></div>

        <!-- Thumbnail Gallery -->
        <div class="grid grid-cols-4 gap-4">
            <div *ngFor="let _ of [].constructor(4)" 
                 class="aspect-video bg-zinc-800 rounded-lg"></div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between pt-4">
            <div class="flex gap-3">
                <div class="h-12 bg-zinc-800 rounded-xl w-32"></div>
                <div class="h-12 bg-zinc-800 rounded-xl w-32"></div>
            </div>
            <div class="flex gap-3">
                <div class="h-12 w-12 bg-zinc-800 rounded-xl"></div>
                <div class="h-12 w-12 bg-zinc-800 rounded-xl"></div>
            </div>
        </div>
    </div>
  `
})
export class ProjectDetailsGallerySkeletonComponent { }
