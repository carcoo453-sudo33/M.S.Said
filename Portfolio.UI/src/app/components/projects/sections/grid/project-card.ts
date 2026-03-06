import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Edit3, Trash2, ArrowRight } from 'lucide-angular';
import { ProjectEntry } from '../../../../models';
import { AuthService } from '../../../../services/auth.service';
import { TranslationHelperService } from '../../../../services/translation-helper.service';
import { ImageUtilsService } from '../../../../services/image-utils.service';
import { CardComponent, CardContentComponent, CardHeaderComponent } from '../../../../ui/card';
import { ButtonComponent } from '../../../../ui/button';
import { BadgeComponent } from '../../../../ui/badge';
import { OptimizedImageComponent } from '../../../shared/optimized-image/optimized-image';

@Component({
    selector: 'app-project-card',
    standalone: true,
    imports: [
        CommonModule, 
        RouterLink, 
        TranslateModule, 
        LucideAngularModule,
        CardComponent,
        CardContentComponent,
        CardHeaderComponent,
        ButtonComponent,
        BadgeComponent,
        OptimizedImageComponent
    ],
    template: `
        <ui-card [routerLink]="['/projects', project.slug]"
            class="group cursor-pointer hover:shadow-xl hover:shadow-red-600/10 hover:border-red-600 transition-all duration-500 relative flex flex-col">

            <!-- Admin Actions -->
            <div *ngIf="auth.isLoggedIn()" class="absolute top-4 left-4 z-30 flex gap-2">
                <ui-button 
                    variant="ghost" 
                    size="icon"
                    (onClick)="onEdit($event)"
                    class="w-10 h-10 rounded-lg bg-black/80 backdrop-blur-md text-white hover:text-red-500 border border-white/10">
                    <lucide-icon [img]="EditIcon" class="w-4 h-4"></lucide-icon>
                </ui-button>
                <ui-button 
                    variant="ghost" 
                    size="icon"
                    (onClick)="onDelete($event)"
                    class="w-10 h-10 rounded-lg bg-black/80 backdrop-blur-md text-white hover:text-red-600 border border-white/10">
                    <lucide-icon [img]="DeleteIcon" class="w-4 h-4"></lucide-icon>
                </ui-button>
            </div>

            <!-- Year Badge -->
            <div class="absolute top-4 right-4 z-20">
                <ui-badge variant="secondary" class="bg-black/80 backdrop-blur-md text-red-600 border border-white/10">
                    {{ (project.duration || '2024').split('-')[0] }}
                </ui-badge>
            </div>

            <!-- Image Section -->
            <div class="relative aspect-[16/9] overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-500"></div>
                <app-optimized-image 
                    [src]="getFullImageUrl(project.imageUrl || '')"
                    [alt]="getProjectTitle(project)"
                    className="w-full h-full group-hover:scale-105 transition-all duration-700"
                    objectFit="cover">
                </app-optimized-image>

                <!-- Tech Stack Tags -->
                <div class="absolute bottom-4 left-4 right-4 z-20 translate-y-4 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
                    <div class="flex flex-wrap gap-1.5">
                        <ng-container *ngFor="let tag of (project.tags || '').split(',')">
                            <ui-badge 
                                *ngIf="tag.trim()"
                                variant="outline"
                                class="bg-white/10 backdrop-blur-md text-[8px] text-white border-white/20">
                                {{ tag.trim() }}
                            </ui-badge>
                        </ng-container>
                    </div>
                </div>
            </div>

            <!-- Content Section -->
            <ui-card-content class="p-5 flex-1 flex flex-col">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-base font-black dark:text-white text-zinc-900 group-hover:text-red-600 transition-colors">
                        {{ getProjectTitle(project) }}
                    </h3>
                    <ui-badge variant="secondary" class="text-[9px] text-zinc-400">
                        {{ project.views || 0 }} {{ 'home.featuredProjects.views' | translate }}
                    </ui-badge>
                </div>

                <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">
                    {{ getProjectNiche(project) }}
                </p>

                <p class="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                    {{ getProjectDescription(project) }}
                </p>

                <ui-button 
                    variant="link" 
                    [routerLink]="['/projects', project.slug]"
                    class="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-600 hover:gap-3 transition-all p-0 h-auto">
                    {{ 'home.featuredProjects.projectInsights' | translate }}
                    <lucide-icon [img]="ArrowRightIcon" class="w-3.5 h-3.5"></lucide-icon>
                </ui-button>
            </ui-card-content>
        </ui-card>
    `
})
export class ProjectCardComponent {
    public auth = inject(AuthService);
    private translationHelper = inject(TranslationHelperService);
    private imageUtils = inject(ImageUtilsService);

    @Input() project!: ProjectEntry;
    @Output() edit = new EventEmitter<ProjectEntry>();
    @Output() delete = new EventEmitter<ProjectEntry>();

    EditIcon = Edit3;
    DeleteIcon = Trash2;
    ArrowRightIcon = ArrowRight;

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