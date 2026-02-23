import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-blog-trending-topics',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-sm border border-zinc-200 dark:border-zinc-800 animate-fade-in-left"
        style="animation-delay: 0.2s">
        <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">Trending Topics
        </h3>
        <div class="flex flex-wrap gap-2">
            <span *ngFor="let tag of topics"
                class="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-red-600 hover:text-white transition-all cursor-pointer">
                #{{ tag }}
            </span>
        </div>
    </div>
  `
})
export class BlogTrendingTopicsComponent {
    @Input() topics: string[] = [];
}
