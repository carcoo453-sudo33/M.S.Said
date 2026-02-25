import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-project-details-specs-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 animate-pulse">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div *ngFor="let _ of [].constructor(4)" class="space-y-3">
                <div class="h-3 bg-zinc-800 rounded w-16"></div>
                <div class="h-6 bg-zinc-800 rounded w-24"></div>
            </div>
        </div>
    </div>
  `
})
export class ProjectDetailsSpecsSkeletonComponent { }
