import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LayoutGrid, List } from 'lucide-angular';

@Component({
    selector: 'app-blog-feed-header',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="flex items-center justify-between mb-8 px-4 animate-fade-in-up">
        <div class="flex items-center gap-3">
            <h2 class="text-2xl font-black tracking-tight dark:text-white">{{ title }}</h2>
            <span class="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
        </div>
        <div
            class="flex items-center gap-4 bg-white dark:bg-zinc-900 p-2 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <button (click)="viewModeChange.emit('grid')" [class.text-red-600]="viewMode === 'grid'"
                class="text-zinc-400 hover:text-zinc-600 p-1 transition-colors">
                <lucide-icon [img]="LayoutGridIcon" class="w-5 h-5"></lucide-icon>
            </button>
            <button (click)="viewModeChange.emit('list')" [class.text-red-600]="viewMode === 'list'"
                class="text-zinc-400 hover:text-zinc-600 p-1 transition-colors">
                <lucide-icon [img]="ListIcon" class="w-5 h-5"></lucide-icon>
            </button>
        </div>
    </div>
  `
})
export class BlogFeedHeaderComponent {
    @Input() title: string = 'Latest Updates';
    @Input() viewMode: 'grid' | 'list' = 'list';
    @Output() viewModeChange = new EventEmitter<'grid' | 'list'>();

    LayoutGridIcon = LayoutGrid;
    ListIcon = List;
}
