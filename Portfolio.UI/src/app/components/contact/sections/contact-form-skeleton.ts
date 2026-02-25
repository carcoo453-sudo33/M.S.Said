import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-contact-form-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 animate-pulse space-y-6">
        <!-- Title -->
        <div class="space-y-3">
            <div class="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-48"></div>
            <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-64"></div>
        </div>

        <!-- Form Fields -->
        <div class="space-y-4">
            <!-- Name Field -->
            <div class="space-y-2">
                <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-20"></div>
                <div class="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full"></div>
            </div>

            <!-- Email Field -->
            <div class="space-y-2">
                <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-24"></div>
                <div class="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full"></div>
            </div>

            <!-- Subject Field -->
            <div class="space-y-2">
                <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-28"></div>
                <div class="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full"></div>
            </div>

            <!-- Message Field -->
            <div class="space-y-2">
                <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-32"></div>
                <div class="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full"></div>
            </div>
        </div>

        <!-- Submit Button -->
        <div class="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full"></div>
    </div>
  `
})
export class ContactFormSkeletonComponent { }
