import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-shared-footer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <footer class="pt-24 pb-16 border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950">
        <div class="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
            <a routerLink="/"
                class="text-2xl font-black tracking-tighter mb-10 flex items-center gap-1 text-zinc-900 dark:text-white group">
                <span
                    class="bg-red-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-2 shadow-lg shadow-red-600/20">M</span>
                Mostafa<span class="text-red-600">.Dev</span>
            </a>
            <div class="flex flex-wrap justify-center gap-10 mb-10">
                <a routerLink="/"
                    class="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors">Origins</a>
                <a routerLink="/timeline"
                    class="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors">Resume</a>
                <a routerLink="/projects"
                    class="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors">Projects</a>
                <a routerLink="/blog"
                    class="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors">Social Feed</a>
                <a routerLink="/contact"
                    class="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors">Connection</a>
            </div>
            <div class="flex items-center gap-4 mb-4">
                <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <p class="text-zinc-400 dark:text-zinc-600 text-[9px] font-black uppercase tracking-[0.5em]">
                    Cognitive Syncing Active</p>
            </div>
            <p class="text-zinc-400 text-[9px] font-black uppercase tracking-[0.4em]">&copy; 2026 Mostafa Samir Said. Engineered for Impact.</p>
        </div>
    </footer>
  `
})
export class SharedFooterComponent { }
