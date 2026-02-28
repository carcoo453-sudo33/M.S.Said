import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-shared-page-header',
    standalone: true,
    imports: [CommonModule],
    template: `
    <header class="mb-2 text-center animate-fade-in-up">
        <div *ngIf="badge"
            class="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-red-600/5 dark:bg-red-600/10 border border-red-600/10 dark:border-red-600/20 mb-8 text-red-600">
            <span class="text-[10px] font-black uppercase tracking-[0.4em]">{{ badge }}</span>
        </div>
        <h1
            class="text-3xl md:text-5xl font-black mb-10 tracking-tighter uppercase leading-tight dark:text-white text-zinc-900">
            <span [innerHTML]="title"></span>
        </h1>
        <div *ngIf="description"
            class="max-w-2xl mx-auto px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
            <p class="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed italic">
                "{{ description }}"
            </p>
        </div>
    </header>
  `
})
export class SharedPageHeaderComponent {
    @Input() badge: string = '';
    @Input() title: string = '';
    @Input() description: string = '';
}
