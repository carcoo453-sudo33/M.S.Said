import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-contact-info-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        <div *ngFor="let _ of [].constructor(3)" 
             class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-4">
            <!-- Icon -->
            <div class="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
            
            <!-- Title -->
            <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-32"></div>
            
            <!-- Content -->
            <div class="space-y-2">
                <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
            </div>
        </div>
    </div>
  `
})
export class ContactInfoSkeletonComponent { }
