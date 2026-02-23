import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Linkedin, Github, Layers, ExternalLink, BookOpen } from 'lucide-angular';

@Component({
    selector: 'app-blog-platform-filter',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-sm border border-zinc-200 dark:border-zinc-800 animate-fade-in-left"
        style="animation-delay: 0.1s">
        <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">Platform Filter
        </h3>
        <div class="space-y-4">
            <button *ngFor="let platform of platforms" (click)="platformChange.emit(platform)"
                [class]="selectedPlatform === platform ? 'text-red-600 bg-red-50 dark:bg-red-600/10' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'"
                class="w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 group text-xs font-black uppercase tracking-widest">
                <div class="flex items-center gap-4">
                    <lucide-icon [img]="getSocialIcon(platform)" class="w-4 h-4"></lucide-icon>
                    <span>{{ platform }}</span>
                </div>
                <span class="text-[10px] opacity-40 group-hover:opacity-100">{{ counts[platform] || 0 }}</span>
            </button>
        </div>
    </div>
  `
})
export class BlogPlatformFilterComponent {
    @Input() platforms: string[] = [];
    @Input() selectedPlatform: string = 'All Posts';
    @Input() counts: { [key: string]: number } = {};
    @Output() platformChange = new EventEmitter<string>();

    getSocialIcon(type?: string) {
        if (!type || type === 'All Posts') return BookOpen;
        switch (type.toLowerCase()) {
            case 'linkedin': return Linkedin;
            case 'github': return Github;
            case 'dev.to': return Layers;
            default: return ExternalLink;
        }
    }
}
