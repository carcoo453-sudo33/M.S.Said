import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Code2, Zap } from 'lucide-angular';
import { BioEntry } from '../../../models';

@Component({
    selector: 'app-home-brief-bio',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <section class="animate-fade-in-up">
        <div class="space-y-12">
            <div>
                <p class="text-red-600 font-bold text-[10px] uppercase tracking-[0.5em] mb-6">Execution Strategy
                </p>
                <h2
                    class="text-5xl md:text-7xl font-black dark:text-white text-zinc-900 leading-[0.9] tracking-tighter uppercase">
                    Delivering <span
                        class="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B7E] to-[#7000FF]">High-Fidelity</span>
                    Solutions.
                </h2>
            </div>

            <p
                class="text-zinc-600 dark:text-zinc-400 text-2xl leading-relaxed max-w-3xl italic border-l-4 border-red-600/20 pl-10">
                {{ bio?.description }}
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div
                    class="p-10 rounded-[3rem] bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/50 hover:border-red-600/30 transition-all group">
                    <div
                        class="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-red-500 mb-8 shadow-lg shadow-black/5">
                        <lucide-icon [img]="Code2Icon" class="w-8 h-8"></lucide-icon>
                    </div>
                    <h4 class="font-black text-2xl mb-4 dark:text-white text-zinc-900 uppercase">Architecture
                    </h4>
                    <p class="text-base text-zinc-500 leading-relaxed">System-first approach using SOLID
                        principles and scalable design patterns for Enterprise applications.</p>
                </div>
                <div
                    class="p-10 rounded-[3rem] bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/50 hover:border-purple-600/30 transition-all group">
                    <div
                        class="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-purple-500 mb-8 shadow-lg shadow-black/5">
                        <lucide-icon [img]="ZapIcon" class="w-8 h-8"></lucide-icon>
                    </div>
                    <h4 class="font-black text-2xl mb-4 dark:text-white text-zinc-900 uppercase">Performance
                    </h4>
                    <p class="text-base text-zinc-500 leading-relaxed">Optimizing every millisecond of runtime
                        to ensure the fastest, most reliable user experience across devices.</p>
                </div>
            </div>
        </div>
    </section>
  `
})
export class HomeBriefBioComponent {
    @Input() bio?: BioEntry;
    Code2Icon = Code2;
    ZapIcon = Zap;
}
