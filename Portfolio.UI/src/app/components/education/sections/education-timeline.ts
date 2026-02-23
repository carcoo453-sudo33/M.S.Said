import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, GraduationCap, MapPin } from 'lucide-angular';
import { EducationEntry } from '../../../models';

@Component({
    selector: 'app-education-timeline',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="space-y-24 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-zinc-100 dark:before:bg-zinc-900">
        <div *ngFor="let item of education; let i = index"
            class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-fade-in-up"
            [style.animation-delay]="(0.1 * i) + 's'">

            <!-- Connector Icon -->
            <div
                class="flex items-center justify-center w-16 h-16 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-400 absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10 group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white transition-all duration-700 shadow-2xl">
                <lucide-icon [img]="GraduationCapIcon" class="w-7 h-7"></lucide-icon>
            </div>

            <div
                class="w-[calc(100%-6rem)] md:w-[calc(50%-4rem)] bg-zinc-50/50 dark:bg-zinc-900/40 p-12 md:p-16 rounded-[4rem] border border-zinc-100 dark:border-zinc-800 group-hover:border-red-600/30 transition-all duration-700 backdrop-blur-xl relative hover:shadow-2xl">
                <span
                    class="inline-block bg-red-600/5 px-5 py-2.5 rounded-2xl text-red-600 text-[10px] font-black tracking-[0.3em] uppercase mb-8 border border-red-600/10">{{
                    item.duration }}</span>
                <h3
                    class="text-3xl md:text-4xl font-black mb-4 uppercase tracking-tighter leading-none dark:text-white text-zinc-900">
                    {{ item.degree }}</h3>
                <p class="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">{{ item.institution
                    }}</p>
                <p class="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed font-medium italic mb-10">"{{
                    item.description }}"</p>
                <div class="flex items-center gap-3 text-zinc-400 group-hover:text-red-600 transition-colors">
                    <lucide-icon [img]="MapPinIcon" class="w-4 h-4"></lucide-icon>
                    <span class="text-[9px] uppercase tracking-[0.4em] font-black">{{ item.location }}</span>
                </div>
            </div>
        </div>
    </div>
  `
})
export class EducationTimelineComponent {
    @Input() education: EducationEntry[] = [];
    GraduationCapIcon = GraduationCap;
    MapPinIcon = MapPin;
}
