import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-project-details-header-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="animate-pulse space-y-6">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2">
            <div class="h-3 bg-zinc-800 rounded w-16"></div>
            <div class="h-3 bg-zinc-800 rounded w-2"></div>
            <div class="h-3 bg-zinc-800 rounded w-24"></div>
        </div>

        <!-- Title -->
        <div class="h-12 bg-zinc-800 rounded-lg w-3/4"></div>

        <!-- Meta Info -->
        <div class="flex flex-wrap items-center gap-4">
            <div class="h-6 bg-zinc-800 rounded-full w-24"></div>
            <div class="h-6 bg-zinc-800 rounded-full w-32"></div>
            <div class="h-6 bg-zinc-800 rounded-full w-28"></div>
        </div>

        <!-- Description -->
        <div class="space-y-2">
            <div class="h-4 bg-zinc-800 rounded w-full"></div>
            <div class="h-4 bg-zinc-800 rounded w-11/12"></div>
            <div class="h-4 bg-zinc-800 rounded w-10/12"></div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
            <div class="h-12 bg-zinc-800 rounded-xl w-32"></div>
            <div class="h-12 bg-zinc-800 rounded-xl w-32"></div>
        </div>
    </div>
  `
})
export class ProjectDetailsHeaderSkeletonComponent { }
