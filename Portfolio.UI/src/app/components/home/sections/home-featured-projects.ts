import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, ArrowRight } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { ProjectEntry } from '../../../models';
import { TranslationService } from '../../../services/translation.service';
import { TranslationUtil } from '../../../utils';
import { ProjectCardComponent } from '../../shared/project-card/project-card';

@Component({
    selector: 'app-home-featured-projects',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, RouterLink, TranslateModule, ProjectCardComponent],
    template: `
    <section class="animate-fade-in-up pt-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
                <div class="flex items-center gap-4 mb-1.5">
                    <div class="w-1 h-8 bg-red-600 rounded-full"></div>
                    <h2 class="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{{ 'home.featuredProjects.title' | translate }}</h2>
                </div>
                <p class="text-zinc-600 dark:text-zinc-400 text-sm ms-5">{{ 'home.featuredProjects.subtitle' | translate }}</p>
            </div>
            <a routerLink="/projects"
                class="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:text-red-600 transition-all ms-5">
                {{ 'home.featuredProjects.viewGithub' | translate }}
                <lucide-icon [img]="ArrowRightIcon" class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"></lucide-icon>
            </a>
        </div>
        
        <!-- Centralized Project Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <app-project-card 
                *ngFor="let project of translatedProjects; let i = index"
                [project]="project"
                [allProjects]="projects"
                [showAdminActions]="false"
                [showTrendingBadge]="true"
                [showLatestBadge]="true"
                [showFeaturedBadge]="true"
                [showYearBadge]="true"
                [showNiche]="false">
            </app-project-card>
        </div>
        
        <!-- View All Projects Button -->
        <div class="flex justify-center mt-10">
            <a routerLink="/projects/all"
                class="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-widest transition-all hover:shadow-xl hover:shadow-red-600/30 hover:scale-105">
                {{ 'home.featuredProjects.viewAll' | translate }}
                <lucide-icon [img]="ArrowRightIcon" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></lucide-icon>
            </a>
        </div>
    </section>
  `
})
export class HomeFeaturedProjectsComponent {
    private readonly translationService = inject(TranslationService);
    
    @Input() projects: ProjectEntry[] = [];
    ArrowRightIcon = ArrowRight;

    get translatedProjects(): ProjectEntry[] {
        const currentLang = this.translationService.currentLang$();
        return TranslationUtil.translateArray(this.projects, ['title', 'description', 'summary'], currentLang);
    }
}
