import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, Edit, Trash2 } from 'lucide-angular';
import { ProjectEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { TranslationService } from '../../../services/translation.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-project-details-header',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule, LucideAngularModule],
    template: `
    <!-- Breadcrumbs -->
    <div class="mb-8 lg:mb-10 animate-fade-in">
        <nav class="flex items-center gap-2 lg:gap-3 text-[10px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] text-zinc-500">
            <a routerLink="/projects" class="hover:text-red-500 transition-colors">{{ 'projectDetails.breadcrumb' | translate }}</a>
            <span class="text-zinc-700">/</span>
            <span class="text-white truncate">{{ project?.title }}</span>
        </nav>
    </div>

    <!-- Header Section -->
    <header *ngIf="project" class="space-y-8 lg:space-y-12 animate-fade-in-up relative">
        <!-- Admin Actions -->
        <div *ngIf="auth.isLoggedIn()" class="absolute top-0 ltr:right-0 rtl:left-0 flex gap-2 lg:gap-3">
            <button (click)="onEditClick()"
                class="flex items-center gap-2 bg-zinc-900 hover:bg-red-600 border border-zinc-800 hover:border-red-600 px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-white transition-all group">
                <lucide-icon [img]="EditIcon" class="w-3.5 h-3.5 lg:w-4 lg:h-4 group-hover:scale-110 transition-transform"></lucide-icon>
                <span class="text-[10px] font-black uppercase">{{ 'projectDetails.edit' | translate }}</span>
            </button>
            <button (click)="onDeleteClick()"
                class="flex items-center gap-2 bg-zinc-900 hover:bg-red-600 border border-zinc-800 hover:border-red-600 px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-white transition-all group">
                <lucide-icon [img]="DeleteIcon" class="w-3.5 h-3.5 lg:w-4 lg:h-4 group-hover:scale-110 transition-transform"></lucide-icon>
                <span class="text-[10px] font-black uppercase">{{ 'projectDetails.delete' | translate }}</span>
            </button>
        </div>

        <div class="space-y-4 lg:space-y-6 pr-32 lg:pr-0">
            <!-- Category & Niche Badges -->
            <div class="flex flex-wrap items-center gap-2 lg:gap-3">
                <span *ngIf="getProjectCategory()" class="bg-red-600/10 border border-red-600/30 text-red-600 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {{ getProjectCategory() }}
                </span>
                <span *ngIf="getProjectNiche()" class="bg-zinc-900 border border-zinc-800 text-zinc-400 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {{ getProjectNiche() }}
                </span>
                <span *ngIf="getProjectCompany()" class="bg-zinc-900 border border-zinc-800 text-zinc-400 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    {{ getProjectCompany() }}
                </span>
            </div>
            
            <h1 class="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-none dark:text-zinc-100 italic">
                {{ getProjectTitle() }}
            </h1>
            
            <!-- Project Summary -->
            <p *ngIf="getProjectSummary()" class="text-lg lg:text-xl text-zinc-400 leading-relaxed font-medium max-w-4xl">
                {{ getProjectSummary() }}
            </p>
        </div>
    </header>
  `
})
export class ProjectDetailsHeaderComponent {
    public auth = inject(AuthService);
    private router = inject(Router);
    private translate = inject(TranslateService);
    private translationService = inject(TranslationService);
    private toast = inject(ToastService);

    @Input() project?: ProjectEntry;
    @Output() onEdit = new EventEmitter<void>();
    @Output() onDelete = new EventEmitter<void>();

    EditIcon = Edit;
    DeleteIcon = Trash2;

    getProjectTitle(): string {
        if (!this.project) return '';
        const currentLang = this.translationService.currentLang$();
        const title = (currentLang === 'ar' && this.project.title_Ar) ? this.project.title_Ar : (this.project.title || 'Untitled Project');

        if (title.includes(':')) {
            const parts = title.split(':');
            return parts[0];
        }
        return title;
    }

    getProjectSummary(): string {
        if (!this.project) return '';
        const currentLang = this.translationService.currentLang$();
        return currentLang === 'ar' && this.project.summary_Ar ? this.project.summary_Ar : (this.project.summary || '');
    }

    getProjectCategory(): string {
        if (!this.project) return '';
        const currentLang = this.translationService.currentLang$();
        return currentLang === 'ar' && this.project.category_Ar ? this.project.category_Ar : (this.project.category || '');
    }

    getProjectNiche(): string {
        if (!this.project) return '';
        const currentLang = this.translationService.currentLang$();
        return currentLang === 'ar' && this.project.niche_Ar ? this.project.niche_Ar : (this.project.niche || '');
    }

    getProjectCompany(): string {
        if (!this.project) return '';
        const currentLang = this.translationService.currentLang$();
        return currentLang === 'ar' && this.project.company_Ar ? this.project.company_Ar : (this.project.company || '');
    }

    onEditClick() {
        this.onEdit.emit();
    }

    onDeleteClick() {
        // Show warning toast and emit delete event
        this.toast.warning('Deleting project...');
        this.onDelete.emit();
    }
}
