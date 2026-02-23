import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowRight } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { ProjectEntry } from '../../../models';

@Component({
    selector: 'app-home-featured-projects',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, RouterLink],
    template: `
    <section class="animate-fade-in-up pt-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
                <div class="flex items-center gap-4 mb-1.5">
                    <div class="w-1 h-8 bg-red-600 rounded-full"></div>
                    <h2 class="text-xl font-black dark:text-white text-zinc-900 tracking-tight">Featured Projects</h2>
                </div>
                <p class="text-zinc-500 text-sm ms-5">Some of the works I am most proud of</p>
            </div>
            <a routerLink="/projects"
                class="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-all ms-5">
                View Github
                <lucide-icon [img]="ArrowRightIcon" class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"></lucide-icon>
            </a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div *ngFor="let project of projects"
                class="group bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800/50 shadow-sm hover:shadow-xl transition-all duration-500">
                <div class="relative aspect-[16/9] overflow-hidden">
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-500">
                    </div>
                    <img [src]="project.imageUrl || 'assets/project-placeholder.png'"
                        class="w-full h-full object-cover group-hover:scale-105 transition-all duration-700">
                    <div
                        class="absolute bottom-4 left-4 right-4 z-20 translate-y-4 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
                        <div class="flex flex-wrap gap-1.5">
                            <span *ngFor="let tech of project.techStack?.split(',')"
                                class="bg-white/10 backdrop-blur-md text-[8px] font-bold px-2.5 py-1 rounded-lg text-white border border-white/20 uppercase tracking-wide">
                                {{ tech.trim() }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="p-5">
                    <h3 class="text-base font-black dark:text-white text-zinc-900 mb-2 group-hover:text-red-600 transition-colors">
                        {{ project.title }}</h3>
                    <p class="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-2">
                        {{ project.description }}
                    </p>
                    <a [routerLink]="['/projects', project.slug]"
                        class="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-600 hover:gap-3 transition-all">
                        Project Insights
                        <lucide-icon [img]="ArrowRightIcon" class="w-3.5 h-3.5"></lucide-icon>
                    </a>
                </div>
            </div>
        </div>
    </section>
  `
})
export class HomeFeaturedProjectsComponent {
    @Input() projects: ProjectEntry[] = [];
    ArrowRightIcon = ArrowRight;
}
