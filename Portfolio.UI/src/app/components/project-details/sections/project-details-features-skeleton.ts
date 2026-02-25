import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-project-details-features-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 animate-pulse space-y-8">
        <!-- Title -->
        <div class="h-6 bg-zinc-800 rounded w-48"></div>

        <!-- Features List -->
        <div class="space-y-6">
            <div *ngFor="let _ of [].constructor(4)" class="space-y-3">
                <div class="flex items-start gap-3">
                    <div class="w-6 h-6 bg-zinc-800 rounded-lg shrink-0"></div>
                    <div class="flex-1 space-y-2">
                        <div class="h-4 bg-zinc-800 rounded w-3/4"></div>
                        <div class="h-3 bg-zinc-800 rounded w-full"></div>
                        <div class="h-3 bg-zinc-800 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `
})
export class ProjectDetailsFeaturesSkeletonComponent { }
