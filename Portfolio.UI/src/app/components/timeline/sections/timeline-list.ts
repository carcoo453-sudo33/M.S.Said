import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceEntry } from '../../../models';

@Component({
    selector: 'app-timeline-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="max-w-5xl mx-auto relative px-4">
        <!-- Central Line -->
        <div
            class="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-zinc-100 dark:bg-zinc-900 transform md:-translate-x-1/2">
        </div>

        <div class="space-y-24">
            <div *ngFor="let item of experiences; let i = index"
                class="relative flex flex-col md:flex-row items-center group animate-fade-in-up"
                [style.animation-delay]="(0.1 * i) + 's'">

                <!-- Connector Dot -->
                <div
                    class="absolute left-2 md:left-1/2 w-3 h-3 rounded-full bg-red-600 transform -translate-x-1/2 z-10 shadow-[0_0_20px_rgba(220,38,38,0.5)] group-hover:scale-150 transition-all duration-500">
                </div>

                <div [ngClass]="{'md:text-right md:pr-20': i % 2 === 0, 'md:pl-20 md:order-last': i % 2 !== 0}"
                    class="pl-12 md:pl-0 w-full md:w-1/2">
                    <div
                        class="bg-zinc-50/50 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 p-10 md:p-14 rounded-[3.5rem] group-hover:border-red-600/30 transition-all duration-700 hover:shadow-2xl">
                        <span
                            class="inline-block bg-red-600/5 px-4 py-2 rounded-xl text-red-600 text-[9px] font-black tracking-[0.3em] uppercase mb-6">{{item.duration}}</span>
                        <h3
                            class="text-4xl font-black mb-2 uppercase tracking-tighter leading-none dark:text-white text-zinc-900">
                            {{item.role}}</h3>
                        <h4 class="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">
                            {{item.company}}</h4>
                        <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium italic">
                            "{{item.description}}"</p>
                    </div>
                </div>
                <div class="hidden md:block w-1/2"></div>
            </div>
        </div>
    </section>
  `
})
export class TimelineListComponent {
    @Input() experiences: ExperienceEntry[] = [];
}
