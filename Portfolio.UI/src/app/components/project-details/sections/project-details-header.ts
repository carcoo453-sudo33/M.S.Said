import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectEntry } from '../../../models';

@Component({
    selector: 'app-project-details-header',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <!-- Breadcrumbs -->
    <div class="mb-12 animate-fade-in">
        <nav class="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            <a routerLink="/projects" class="hover:text-red-500 transition-colors">Projects</a>
            <span class="text-zinc-700">/</span>
            <span class="text-white">{{ project?.title }}</span>
        </nav>
    </div>

    <!-- Header Section -->
    <header *ngIf="project" class="space-y-12 animate-fade-in-up">
        <div class="space-y-6">
            <h1 class="text-5xl md:text-8xl font-black tracking-tighter leading-none dark:text-zinc-100 italic">
                {{ project.title.split(':')[0] }}<span class="text-red-600" *ngIf="project.title.includes(':')">: {{
                    project.title.split(':')[1] }}</span>
            </h1>
            <p class="text-zinc-400 text-lg md:text-2xl max-w-3xl leading-relaxed font-medium">
                {{ project.summary }}
            </p>
        </div>

        <!-- Tech Tags -->
        <div class="flex flex-wrap gap-3">
            <span *ngFor="let tech of project.techStack?.split(',')"
                class="bg-zinc-900 border border-zinc-800 px-6 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase text-zinc-500 hover:text-red-600 hover:border-red-600/30 transition-all cursor-default">
                {{ tech.trim() }}
            </span>
        </div>
    </header>
  `
})
export class ProjectDetailsHeaderComponent {
    @Input() project?: ProjectEntry;
}
