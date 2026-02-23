import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceEntry } from '../../../models';

@Component({
    selector: 'app-projects-work-history',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="mt-48 animate-fade-in-up">
        <div class="flex items-center gap-6 mb-20">
            <div class="w-2 h-12 bg-red-600 rounded-full"></div>
            <h2 class="text-5xl font-black dark:text-white text-zinc-900 tracking-tighter uppercase italic">Work
                History
            </h2>
        </div>

        <div class="space-y-16 relative">
            <div *ngFor="let exp of experiences" class="relative pl-16 group">
                <!-- Timeline Line -->
                <div
                    class="absolute left-0 top-0 bottom-0 w-[1px] bg-zinc-100 dark:bg-zinc-800 group-last:bg-gradient-to-b group-last:from-zinc-100 dark:group-last:from-zinc-800 group-last:to-transparent">
                </div>
                <!-- Timeline Dot -->
                <div
                    class="absolute left-[-6px] top-3 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-200 dark:bg-zinc-800 group-hover:bg-red-600 group-hover:scale-150 transition-all shadow-xl">
                </div>

                <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div class="space-y-4">
                        <h3
                            class="text-3xl font-black dark:text-white text-zinc-900 uppercase tracking-tight flex items-center gap-4 italic">
                            {{ exp.role }} <span
                                class="text-red-600 text-sm font-black tracking-[0.2em] uppercase">@ {{
                                exp.company }}</span>
                        </h3>
                        <p
                            class="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed max-w-3xl font-medium">
                            {{ exp.description }}
                        </p>
                    </div>
                    <div class="text-left shrink-0">
                        <span
                            class="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 block mb-2">{{
                            exp.duration }}</span>
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">{{
                            exp.location }}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
  `
})
export class ProjectsWorkHistoryComponent {
    @Input() experiences: ExperienceEntry[] = [];
}
