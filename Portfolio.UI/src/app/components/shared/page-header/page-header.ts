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
        <p *ngIf="description"
            class="text-zinc-500 dark:text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed italic border-l-2 md:border-l-0 md:border-b-2 border-zinc-100 dark:border-zinc-900 pl-8 md:pl-0 md:pb-8">
            "{{ description }}"
        </p>
    </header>
  `
})
export class SharedPageHeaderComponent {
    @Input() badge: string = '';
    @Input() title: string = '';
    @Input() description: string = '';
}
