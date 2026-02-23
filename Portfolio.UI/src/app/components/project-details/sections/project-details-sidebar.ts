import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectEntry } from '../../../models';

@Component({
    selector: 'app-project-details-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div *ngIf="project" class="contents">
        <!-- Changelog -->
        <section class="space-y-8">
            <div class="flex items-center gap-4">
                <div class="w-1 h-8 bg-red-600 rounded-full"></div>
                <h2 class="text-2xl font-black italic tracking-tighter uppercase leading-none">Changelog</h2>
            </div>
            <div class="space-y-6 relative">
                <div class="absolute left-0 top-3 bottom-0 w-[1px] bg-zinc-900"></div>
                <div *ngFor="let log of project.changelog" class="relative pl-8 space-y-3">
                    <div class="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-red-600 shadow-lg shadow-red-600/40"></div>
                    <div class="text-[10px] font-bold text-red-600 tracking-widest">{{ log.date }}</div>
                    <div class="bg-zinc-900/40 p-6 rounded-xl border border-zinc-800/50 hover:bg-zinc-900 transition-all group">
                        <h4 class="text-white font-black uppercase tracking-tight mb-2 text-sm group-hover:text-red-600 transition-colors">
                            {{ log.version }} {{ log.title }}</h4>
                        <p class="text-zinc-500 text-xs leading-relaxed">{{ log.description }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Metrics -->
        <section class="bg-zinc-950 p-8 rounded-2xl border border-zinc-900 space-y-8 shadow-2xl relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[80px]"></div>
            <div class="flex items-center gap-4 relative z-10">
                <div class="w-1 h-8 bg-red-600 rounded-full"></div>
                <h2 class="text-2xl font-black italic tracking-tighter uppercase leading-none">Metrics</h2>
            </div>
            <div class="space-y-6 relative z-10">
                <div *ngFor="let metric of project.metrics" class="flex items-center justify-between group pb-4 border-b border-zinc-800/50 last:border-0">
                    <span class="text-zinc-500 text-sm font-medium">{{ metric.label }}</span>
                    <span class="text-white font-black text-xl italic group-hover:text-red-600 transition-colors">{{ metric.value }}</span>
                </div>
            </div>
        </section>

        <!-- Related Projects -->
        <section class="space-y-8">
            <div class="flex items-center gap-4">
                <div class="w-1 h-8 bg-red-600 rounded-full"></div>
                <h2 class="text-2xl font-black italic tracking-tighter uppercase leading-none">Related</h2>
            </div>
            <div class="space-y-6">
                <div *ngFor="let related of project.relatedProjects" [routerLink]="['/projects', related.slug]"
                    class="flex gap-4 p-4 bg-zinc-950 rounded-xl border border-zinc-900 hover:border-red-600/30 transition-all group cursor-pointer">
                    <div class="w-24 aspect-video rounded-lg overflow-hidden border border-zinc-800 shrink-0">
                        <img [src]="related.imageUrl" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all">
                    </div>
                    <div class="space-y-2 flex-1">
                        <h4 class="text-white font-black text-sm uppercase tracking-tight group-hover:text-red-600 transition-colors line-clamp-2">{{ related.title }}</h4>
                        <div class="flex flex-wrap gap-1" *ngIf="related.technologies">
                            <span *ngFor="let t of related.technologies.split(',').slice(0, 3)" class="text-[9px] font-bold text-zinc-600 uppercase">{{ t.trim() }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  `
})
export class ProjectDetailsSidebarComponent {
    @Input() project?: ProjectEntry;
}
