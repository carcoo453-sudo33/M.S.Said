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
    <section class="animate-fade-in-up">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
                <div class="flex items-center gap-6 mb-6">
                    <div class="w-2 h-12 bg-red-600 rounded-full"></div>
                    <h2 class="text-5xl font-black dark:text-white text-zinc-900 tracking-tighter uppercase">
                        What I Build</h2>
                </div>
                <p class="text-zinc-500 text-lg max-w-lg">A deep dive into complex problems solved with elegant,
                    scalable engineering.</p>
            </div>
            <a routerLink="/projects"
                class="group flex items-center gap-4 bg-zinc-900 dark:bg-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-widest text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-xl shadow-black/10">
                View Full Portfolio
                <lucide-icon [img]="ArrowRightIcon"
                    class="w-4 h-4 group-hover:translate-x-2 transition-transform"></lucide-icon>
            </a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div *ngFor="let project of projects"
                class="group bg-zinc-50/50 dark:bg-zinc-900/40 rounded-[4rem] overflow-hidden border border-zinc-100 dark:border-zinc-800/50 shadow-sm hover:shadow-2xl transition-all duration-1000">
                <div class="relative aspect-[16/10] overflow-hidden">
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-700">
                    </div>
                    <img [src]="project.imageUrl || 'assets/project-placeholder.png'"
                        class="w-full h-full object-cover dark:grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000">
                    <div
                        class="absolute bottom-10 left-10 right-10 z-20 translate-y-8 group-hover:translate-y-0 transition-all duration-700 opacity-0 group-hover:opacity-100">
                        <div class="flex flex-wrap gap-2">
                            <span *ngFor="let tech of project.techStack?.split(',')"
                                class="bg-white/10 backdrop-blur-md text-[9px] font-black px-4 py-2 rounded-xl text-white border border-white/20 uppercase tracking-widest">
                                {{ tech.trim() }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="p-12">
                    <h3
                        class="text-3xl font-black dark:text-white text-zinc-900 mb-6 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                        {{ project.title }}</h3>
                    <p class="text-zinc-500 text-base leading-relaxed mb-10 line-clamp-3 italic">"{{
                        project.description }}"</p>
                    <a [routerLink]="['/projects', project.slug]"
                        class="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-red-600 hover:gap-6 transition-all group/lnk">
                        Project Insights
                        <lucide-icon [img]="ArrowRightIcon" class="w-4 h-4"></lucide-icon>
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
