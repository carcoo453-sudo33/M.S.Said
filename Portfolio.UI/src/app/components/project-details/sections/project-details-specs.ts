import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Code, Clock, Layers, CheckCircle } from 'lucide-angular';
import { ProjectEntry } from '../../../models';

@Component({
    selector: 'app-project-details-specs',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <section *ngIf="project" class="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up" style="animation-delay: 0.1s">
        <div class="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl space-y-3 hover:bg-zinc-900 transition-colors">
            <div class="flex items-center gap-3 text-red-600">
                <lucide-icon [img]="CodeIcon" class="w-4 h-4"></lucide-icon>
                <span class="text-[10px] font-black uppercase tracking-widest">Language</span>
            </div>
            <div class="text-xl font-black italic uppercase">{{ project.language || 'TypeScript' }}</div>
        </div>
        <div class="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl space-y-3 hover:bg-zinc-900 transition-colors">
            <div class="flex items-center gap-3 text-red-600">
                <lucide-icon [img]="ClockIcon" class="w-4 h-4"></lucide-icon>
                <span class="text-[10px] font-black uppercase tracking-widest">Duration</span>
            </div>
            <div class="text-xl font-black italic uppercase">{{ project.duration || '4 Months' }}</div>
        </div>
        <div class="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl space-y-3 hover:bg-zinc-900 transition-colors">
            <div class="flex items-center gap-3 text-red-600">
                <lucide-icon [img]="LayersIcon" class="w-4 h-4"></lucide-icon>
                <span class="text-[10px] font-black uppercase tracking-widest">Architecture</span>
            </div>
            <div class="text-xl font-black italic uppercase">{{ project.architecture || 'Microservices' }}</div>
        </div>
        <div class="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl space-y-3 hover:bg-zinc-900 transition-colors">
            <div class="flex items-center gap-3 text-red-600">
                <lucide-icon [img]="CheckIcon" class="w-4 h-4"></lucide-icon>
                <span class="text-[10px] font-black uppercase tracking-widest">Status</span>
            </div>
            <div class="text-xl font-black italic uppercase text-green-500">{{ project.status || 'Active & Stable' }}</div>
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
