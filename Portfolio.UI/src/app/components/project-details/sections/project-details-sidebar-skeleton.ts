import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-project-details-sidebar-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-8 animate-pulse">
        <!-- Changelog Section -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
            <div class="h-6 bg-zinc-800 rounded w-32"></div>
            <div class="space-y-4">
                <div *ngFor="let _ of [].constructor(3)" class="space-y-2">
                    <div class="h-4 bg-zinc-800 rounded w-3/4"></div>
                    <div class="h-3 bg-zinc-800 rounded w-full"></div>
                    <div class="h-3 bg-zinc-800 rounded w-5/6"></div>
                </div>
            </div>
        </div>
    </div>
  `
})
export class ProjectDetailsSidebarSkeletonComponent { }
