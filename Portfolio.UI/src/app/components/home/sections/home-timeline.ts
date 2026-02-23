import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceEntry } from '../../../models';

@Component({
    selector: 'app-home-timeline',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="animate-fade-in-up">
        <div class="flex items-center justify-between gap-6 mb-16">
            <div class="flex items-center gap-6">
                <div class="w-2 h-12 bg-red-600 rounded-full"></div>
                <h2 class="text-5xl font-black dark:text-white text-zinc-900 tracking-tighter uppercase">
                    Timeline</h2>
            </div>
        </div>
        <div class="space-y-16">
            <div *ngFor="let exp of experiences" class="relative pl-16 group">
                <div
                    class="absolute left-0 top-0 bottom-0 w-[1px] bg-zinc-100 dark:bg-zinc-800 group-last:bg-gradient-to-b group-last:from-zinc-100 dark:group-last:from-zinc-800 group-last:to-transparent">
                </div>
                <div
                    class="absolute left-[-6px] top-3 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-200 dark:bg-zinc-800 group-hover:bg-red-600 group-hover:scale-150 transition-all shadow-xl">
                </div>

                <div class="mb-4">
                    <span
                        class="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 bg-red-600/5 px-4 py-2 rounded-xl mb-6 inline-block border border-red-600/10">{{
                        exp.duration }}</span>
                    <h3 class="text-3xl font-black dark:text-white text-zinc-900 uppercase tracking-tight">{{
                        exp.role }}</h3>
                </div>
                <div
                    class="flex items-center gap-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-8">
                    <span>{{ exp.company }}</span>
                    <span class="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800"></span>
                    <span>{{ exp.location }}</span>
                </div>
                <p class="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed max-w-2xl font-medium">{{
                    exp.description }}</p>
            </div>
        </div>
    </section>
  `
})
export class HomeTimelineComponent {
    @Input() experiences: ExperienceEntry[] = [];
}
