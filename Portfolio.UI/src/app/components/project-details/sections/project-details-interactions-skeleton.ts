import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-project-details-interactions-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-16 animate-pulse">
        <!-- Section Title -->
        <div class="h-8 bg-zinc-800 rounded w-32"></div>

        <!-- Comment Form -->
        <div class="flex gap-6">
            <div class="w-14 h-14 bg-zinc-800 rounded-xl shrink-0"></div>
            <div class="flex-1 space-y-4">
                <div class="h-3 bg-zinc-800 rounded w-48"></div>
                <div class="h-32 bg-zinc-800 rounded-xl"></div>
                <div class="flex justify-end">
                    <div class="h-12 bg-zinc-800 rounded-xl w-32"></div>
                </div>
            </div>
        </div>

        <!-- Comments List -->
        <div class="space-y-12">
            <div *ngFor="let _ of [].constructor(3)" class="flex gap-6">
                <div class="w-14 h-14 bg-zinc-800 rounded-xl shrink-0"></div>
                <div class="flex-1 space-y-3">
                    <div class="flex items-center gap-4">
                        <div class="h-4 bg-zinc-800 rounded w-24"></div>
                        <div class="h-3 bg-zinc-800 rounded w-16"></div>
                    </div>
                    <div class="space-y-2">
                        <div class="h-3 bg-zinc-800 rounded w-full"></div>
                        <div class="h-3 bg-zinc-800 rounded w-11/12"></div>
                        <div class="h-3 bg-zinc-800 rounded w-10/12"></div>
                    </div>
                    <div class="flex items-center gap-4 pt-2">
                        <div class="h-8 bg-zinc-800 rounded-lg w-20"></div>
                        <div class="h-4 bg-zinc-800 rounded w-16"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `
})
export class ProjectDetailsInteractionsSkeletonComponent { }
