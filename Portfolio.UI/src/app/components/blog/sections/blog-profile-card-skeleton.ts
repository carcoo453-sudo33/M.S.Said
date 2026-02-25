import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-blog-profile-card-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 animate-pulse">
        <!-- Avatar -->
        <div class="flex justify-center mb-6">
            <div class="w-24 h-24 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
        </div>
        
        <!-- Name -->
        <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-3/4 mx-auto mb-3"></div>
        
        <!-- Title -->
        <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-1/2 mx-auto mb-6"></div>
        
        <!-- Description -->
        <div class="space-y-2 mb-6">
            <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full"></div>
            <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-5/6"></div>
            <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-4/6"></div>
        </div>
        
        <!-- Social Links -->
        <div class="flex justify-center gap-3">
            <div class="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
            <div class="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
            <div class="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
            <div class="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
        </div>
    </div>
  `
})
export class BlogProfileCardSkeletonComponent { }
