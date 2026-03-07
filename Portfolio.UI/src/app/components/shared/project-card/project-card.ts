import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Edit3, Trash2, ArrowRight } from 'lucide-angular';
import { ProjectEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { TranslationHelperService } from '../../../services/translation-helper.service';
import { ImageUtilsService } from '../../../services/image-utils.service';
import { OptimizedImageComponent } from '../optimized-image/optimized-image';

@Component({
    selector: 'app-project-card',
    standalone: true,
    imports: [
        CommonModule, 
        RouterLink, 
        TranslateModule, 
        LucideAngularModule,
        OptimizedImageComponent
    ],
    template: `
        <div [routerLink]="['/projects', project.slug]"
            class="group cursor-pointer bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-red-600/10 hover:border-red-600 transition-all duration-500 relative flex flex-col h-[420px]">

            <!-- Image Section -->
            <div class="relative aspect-[16/9] overflow-hidden">
                <!-- Admin Actions -->
                <div *ngIf="auth.isLoggedIn() && showAdminActions" class="absolute top-4 left-4 z-30 flex gap-2">
                    <button 
                        (click)="onEdit($event)"
                        class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-black/80 backdrop-blur-md text-white hover:text-red-500 border border-white/10 transition-all">
                        <lucide-icon [img]="EditIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                    <button 
                        (click)="onDelete($event)"
                        class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-black/80 backdrop-blur-md text-white hover:text-red-600 border border-white/10 transition-all">
                        <lucide-icon [img]="DeleteIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                </div>

                <!-- Top Badges - Year (Left) and Type (Right) -->
                <div class="absolute top-4 left-0 right-0 z-30 flex items-start justify-between px-4">
                    <!-- Year Badge (Left) -->
                    <span *ngIf="showYearBadge" 
                        class="inline-flex items-center px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md text-white border border-white/10 text-xs font-medium">
                        {{ (project.duration || '2024').split('-')[0] }}
                    </span>
                    
                    <!-- Type Badge (Right) -->
                    <div class="flex flex-col gap-2">
                        <span *ngIf="showTrendingBadge && isTrending" 
                            class="bg-red-600/90 backdrop-blur-md text-white text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-[0.2em] shadow-lg shadow-red-600/20">
                            {{ 'home.featuredProjects.trending' | translate }}
                        </span>
                        <span *ngIf="showLatestBadge && isLatest && !isTrending" 
                            class="bg-blue-600/90 backdrop-blur-md text-white text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20">
                            {{ 'home.featuredProjects.latest' | translate }}
                        </span>
                        <span *ngIf="showFeaturedBadge && isFeatured && !isTrending && !isLatest" 
                            class="bg-amber-600/90 backdrop-blur-md text-white text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-[0.2em] shadow-lg shadow-amber-600/20">
                            {{ 'home.featuredProjects.featured' | translate }}
                        </span>
                    </div>
                </div>

                <!-- Hover Gradient -->
                <div class="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-500"></div>
                
                <!-- Project Image -->
                <app-optimized-image 
                    [src]="getFullImageUrl(project.imageUrl || '')"
                    [alt]="getProjectTitle(project)"
                    className="w-full h-full group-hover:scale-105 transition-all duration-700"
                    objectFit="cover">
                </app-optimized-image>

                <!-- Tech Stack Tags (Bottom of Image) -->
                <div class="absolute bottom-4 left-4 right-4 z-20 translate-y-4 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
                    <div class="flex flex-wrap gap-1.5">
                        <ng-container *ngFor="let tag of (project.tags || '').split(',')">
                            <span 
                                *ngIf="tag.trim()"
                                class="bg-white/10 backdrop-blur-md text-[8px] font-bold px-2.5 py-1 rounded-lg text-white border border-white/20 uppercase tracking-wide">
                                {{ tag.trim() }}
                            </span>
                        </ng-container>
                    </div>
                </div>
            </div>

            <!-- Content Section -->
            <div class="p-5 flex-1 flex flex-col">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-base font-black dark:text-white text-zinc-900 group-hover:text-red-600 transition-colors">
                        {{ getProjectTitle(project) }}
                    </h3>
                    <span class="inline-flex items-center px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[9px] font-medium">
                        {{ project.views || 0 }} {{ 'home.featuredProjects.views' | translate }}
                    </span>
                </div>

                <p *ngIf="showNiche" class="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">
                    {{ getProjectNiche(project) }}
                </p>

                <!-- Tags Display -->
                <div *ngIf="project.tags" class="flex flex-wrap gap-1.5 mb-3">
                    <ng-container *ngFor="let tag of (project.tags || '').split(',')">
                        <span 
                            *ngIf="tag.trim()"
                            class="inline-flex items-center px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[8px] font-medium uppercase tracking-wide">
                            {{ tag.trim() }}
                        </span>
                    </ng-container>
                </div>

                <p class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                    {{ getProjectDescription(project) }}
                </p>

                <a 
                    [routerLink]="['/projects', project.slug]"
                    class="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-600 hover:gap-3 transition-all">
                    {{ 'home.featuredProjects.projectInsights' | translate }}
                    <lucide-icon [img]="ArrowRightIcon" class="w-3.5 h-3.5"></lucide-icon>
                </a>
            </div>
        </div>
    `
})
export class ProjectCardComponent implements OnInit {
    public auth = inject(AuthService);
    private translationHelper = inject(TranslationHelperService);
    private imageUtils = inject(ImageUtilsService);

    @Input() project!: ProjectEntry;
    @Input() showAdminActions = true; // Show edit/delete buttons
    @Input() showTrendingBadge = false; // Show trending badge
    @Input() showLatestBadge = false; // Show latest badge
    @Input() showFeaturedBadge = false; // Show featured badge
    @Input() showYearBadge = true; // Show year badge
    @Input() showNiche = true; // Show niche text
    @Input() isTrending = false; // Is this project trending
    @Input() isLatest = false; // Is this project latest
    @Input() isFeatured = false; // Is this project featured
    @Input() allProjects: ProjectEntry[] = []; // All projects for comparison
    
    @Output() edit = new EventEmitter<ProjectEntry>();
    @Output() delete = new EventEmitter<ProjectEntry>();

    EditIcon = Edit3;
    DeleteIcon = Trash2;
    ArrowRightIcon = ArrowRight;

    ngOnInit() {
        // Auto-calculate trending/latest if allProjects provided
        if (this.allProjects.length > 0) {
            this.calculateStatus();
        }
    }

    private calculateStatus() {
        if (this.showTrendingBadge) {
            const maxViews = Math.max(...this.allProjects.map(p => p.views || 0));
            this.isTrending = (this.project.views || 0) === maxViews && maxViews > 0;
        }

        if (this.showLatestBadge) {
            const latestDate = Math.max(...this.allProjects.map(p => 
                p.createdAt ? new Date(p.createdAt).getTime() : 0
            ));
            this.isLatest = (this.project.createdAt ? new Date(this.project.createdAt).getTime() : 0) === latestDate;
        }

        if (this.showFeaturedBadge) {
            this.isFeatured = !!(this.project as any).isFeatured;
        }
    }

    onEdit(event: Event) {
        event.stopPropagation();
        event.preventDefault();
        this.edit.emit(this.project);
    }

    onDelete(event: Event) {
        event.stopPropagation();
        event.preventDefault();
        this.delete.emit(this.project);
    }

    getProjectTitle(project: ProjectEntry): string {
        return this.translationHelper.getTranslatedField(project, 'title');
    }

    getProjectDescription(project: ProjectEntry): string {
        return this.translationHelper.getTranslatedField(project, 'description');
    }

    getProjectNiche(project: ProjectEntry): string {
        return this.translationHelper.getTranslatedField(project, 'niche');
    }

    getFullImageUrl(url: string): string {
        return this.imageUtils.getFullImageUrl(url);
    }
}