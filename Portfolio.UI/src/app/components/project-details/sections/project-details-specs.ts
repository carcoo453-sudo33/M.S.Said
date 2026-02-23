import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Code, Clock, Layers, CheckCircle } from 'lucide-angular';
import { ProjectEntry } from '../../../models';

@Component({
    selector: 'app-project-details-specs',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <section *ngIf="project" class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 animate-fade-in-up" style="animation-delay: 0.1s">
        <div class="bg-zinc-900/40 border border-zinc-800 p-4 lg:p-6 rounded-xl lg:rounded-2xl space-y-3 lg:space-y-4 hover:bg-zinc-900 hover:border-zinc-700 transition-all">
            <div class="flex items-center gap-2 lg:gap-3 text-red-600">
                <lucide-icon [img]="CodeIcon" class="w-4 h-4 lg:w-5 lg:h-5"></lucide-icon>
                <span class="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">Language</span>
            </div>
            <div class="text-sm lg:text-lg xl:text-xl font-black italic uppercase text-white truncate">{{ project.language || 'Multiple Languages' }}</div>
        </div>
        <div class="bg-zinc-900/40 border border-zinc-800 p-4 lg:p-6 rounded-xl lg:rounded-2xl space-y-3 lg:space-y-4 hover:bg-zinc-900 hover:border-zinc-700 transition-all">
            <div class="flex items-center gap-2 lg:gap-3 text-red-600">
                <lucide-icon [img]="ClockIcon" class="w-4 h-4 lg:w-5 lg:h-5"></lucide-icon>
                <span class="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">Duration</span>
            </div>
            <div class="text-sm lg:text-lg xl:text-xl font-black italic uppercase text-white">{{ project.duration || '2024-2025' }}</div>
        </div>
        <div class="bg-zinc-900/40 border border-zinc-800 p-4 lg:p-6 rounded-xl lg:rounded-2xl space-y-3 lg:space-y-4 hover:bg-zinc-900 hover:border-zinc-700 transition-all">
            <div class="flex items-center gap-2 lg:gap-3 text-red-600">
                <lucide-icon [img]="LayersIcon" class="w-4 h-4 lg:w-5 lg:h-5"></lucide-icon>
                <span class="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">Architecture</span>
            </div>
            <div class="text-sm lg:text-lg xl:text-xl font-black italic uppercase text-white truncate">{{ project.architecture || 'Scalable Architecture' }}</div>
        </div>
        <div class="bg-zinc-900/40 border border-zinc-800 p-4 lg:p-6 rounded-xl lg:rounded-2xl space-y-3 lg:space-y-4 hover:bg-zinc-900 hover:border-zinc-700 transition-all">
            <div class="flex items-center gap-2 lg:gap-3 text-red-600">
                <lucide-icon [img]="CheckIcon" class="w-4 h-4 lg:w-5 lg:h-5"></lucide-icon>
                <span class="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">Status</span>
            </div>
            <div class="text-sm lg:text-lg xl:text-xl font-black italic uppercase text-green-500">{{ project.status || 'Active' }}</div>
        </div>
    </section>
  `
})
export class ProjectDetailsSpecsComponent {
    @Input() project?: ProjectEntry;
    CodeIcon = Code;
    ClockIcon = Clock;
    LayersIcon = Layers;
    CheckIcon = CheckCircle;
}
